import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import amqp, { Channel, ChannelModel } from "amqplib";
import { ExchangeType, ExchangeTypeEnum, PublishHeadersInterface, RabbitMQConsumerMessage, RetryMechanismHeaderEnum } from "./rabbit-mq.type";

@Injectable()
export class RabbitMQService implements OnModuleDestroy {
    private readonly logger = new Logger(RabbitMQService.name);

    private connection: ChannelModel | undefined;
    private isConnecting = false;
    private isClosing = false;

    constructor() { }

    async onModuleDestroy(): Promise<void> {
        await this.closeConnection();
        this.logger.warn('RabbitMQ connection closed.');
    }

    async createChannel(): Promise<Channel> {
        try {
            const connection = await this.getOrCreateConnection();
            const channel = await connection.createChannel();

            await channel.prefetch(Number(process.env.RABBIT_MQ_PREFETCH_COUNT) || 25);

            channel.on('error', (err: any) => {
                this.logger.error('Channel error', err);
            });

            return channel;
        } catch (error) {
            this.logger.error("Error creating RabbitMQ channel:", error);
            throw error;
        }
    }

    private async getOrCreateConnection(): Promise<ChannelModel> {
        if (this.connection) return this.connection;

        if (this.isConnecting) {
            while (this.isConnecting) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            if (this.connection) return this.connection;
        }

        this.isConnecting = true;
        try {
            this.connection = await amqp.connect(process.env.RABBIT_MQ_URL ?? "amqp://localhost:5672");

            this.connection.on("close", () => {
                this.connection = undefined;
                if (this.isClosing) return;
                this.logger.warn("Connection closed, reconnecting...");
            });

            this.logger.log("Connection created to RabbitMQ");
            return this.connection;
        } finally {
            this.isConnecting = false;
        }
    }

    async setupRetryQueue(channel: Channel, originalQueue: string, retryDelay = Number(process.env.RETRYDELAY) || 15000) {
        const retryQueue = `${originalQueue}.retry`;
        await channel.assertQueue(retryQueue, {
            durable: true,
            messageTtl: retryDelay,
            deadLetterExchange: "",
            deadLetterRoutingKey: originalQueue,
        });
    }

    async setupExchangeQueueAndBind(
        channel: Channel,
        queue: string,
        exchange: string,
        routingKey: string,
        type: ExchangeType = ExchangeTypeEnum.DIRECT,
        headers?: PublishHeadersInterface
    ) {
        try {
            await channel.assertExchange(exchange, type, { durable: true, });
            await channel.assertQueue(queue, {
                durable: true,
                deadLetterExchange: "",
                deadLetterRoutingKey: `${queue}.dlq`
            });
            await channel.assertQueue(`${queue}.dlq`, { durable: true });
            await channel.bindQueue(queue, exchange, routingKey, headers);
        } catch (error) {
            this.logger.error("Error while setting up queue:", error);
            throw error;
        }
    }

    async consumeMessages<TPayload = unknown>(
        channel: Channel,
        queueName: string,
        callback: (data: RabbitMQConsumerMessage<TPayload>) => Promise<void>,
    ) {
        try {
            await channel.consume(
                queueName,
                async (msg) => {
                    if (!msg) return;

                    try {
                        const content = JSON.parse(msg.content.toString());
                        await callback(content);
                        channel.ack(msg);
                    } catch (err) {
                        this.logger.error(`Consumer error on queue ${queueName}`, err);

                        const maxTries = Number(process.env.RABBIT_MQ_MAX_TRY) || 5;
                        const maxRequeues = Number(process.env.RABBIT_MQ_MAX_REQUEUE_TRY) || 3;
                        const requeueTry = (msg.properties.headers?.[RetryMechanismHeaderEnum.XREQUEUETRY] || 0) as number;

                        for (let attempt = 1; attempt <= maxTries; attempt++) {
                            try {
                                const content = JSON.parse(msg.content.toString());
                                await callback(content);
                                channel.ack(msg);
                                return;
                            } catch (error) { }
                        }

                        if (requeueTry + 1 < maxRequeues) {
                            const retryQueue = `${queueName}.retry`;
                            channel.sendToQueue(retryQueue, msg.content, {
                                persistent: true,
                                headers: { ...msg.properties.headers, [RetryMechanismHeaderEnum.XREQUEUETRY]: requeueTry + 1 },
                            });
                            channel.ack(msg);
                            return;
                        }

                        channel.nack(msg, false, false);
                    }
                },
                { noAck: false },
            );
        } catch (error) {
            this.logger.error(`Error while starting consumption on queue ${queueName}:`, error);
            throw error;
        }
    }

    async publishToExchange(
        channel: Channel,
        exchange: string,
        routingKey: string,
        message: RabbitMQConsumerMessage,
        headers?: PublishHeadersInterface
    ) {
        try {
            const buffer = Buffer.from(JSON.stringify(message));
            channel.publish(exchange, routingKey, buffer, {
                persistent: true,
                headers: { ...headers, [RetryMechanismHeaderEnum.XREQUEUETRY]: 0 },
            });
        } catch (error) {
            this.logger.error("MQ Event Publish Error =>", error);
            throw error;
        }
    }

    async closeConnection() {
        if (this.connection) {
            this.isClosing = true;
            await this.connection.close();
            this.connection = undefined;
            this.logger.log("RabbitMQ shared connection closed");
        }
    }
}