import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import amqp, { Channel, ChannelModel } from "amqplib";
import { ExchangeType, ExchangeTypeEnum, PublishHeadersInterface, RabbitMQConsumerMessage, RetryMechanismHeaderEnum } from "./rabbit-mq.type";

let connection: ChannelModel | undefined;
let isConnecting = false;

@Injectable()
export abstract class RabbitMQAbstractService implements OnModuleInit, OnModuleDestroy {
    protected channel?: Channel;
    protected readonly logger = new Logger();
    private isClosing = false;

    constructor() { }

    protected abstract readonly queueName: string;

    async onModuleInit() {
        await this.connectToRabbitMQ();
    }

    async onModuleDestroy() {
        await this.closeChannel();
    }

    async connectToRabbitMQ() {
        if (this.channel) return;

        try {
            const conn = await this.getOrCreateConnection();
            this.channel = await conn.createChannel();
            await this.setupInitialCreation();

            await this.channel.prefetch(Number(process.env.RABBIT_MQ_PREFETCH_COUNT) || 25);

            this.channel.on('error', (err: any) => {
                this.logger.error('Channel error', err);
            });

            this.logger.log("Connected to RabbitMQ and created the channel");
        } catch (error) {
            this.logger.error("Error connecting to RabbitMQ:", error);
            if (!this.isClosing) {
                setTimeout(() => this.connectToRabbitMQ(), 5000);
            }
        }
    }

    private async getOrCreateConnection(): Promise<ChannelModel> {
        if (connection) return connection;

        if (isConnecting) {
            while (isConnecting) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            if (connection) return connection;
        }

        isConnecting = true;
        try {
            connection = await amqp.connect(process.env.RABBIT_MQ_URL ?? "amqp://localhost:5672");

            connection.on("close", () => {
                connection = undefined;
                if (this.isClosing) return;
                this.logger.warn("Connection closed, reconnecting...");
            });

            this.logger.log("Connection created to RabbitMQ");
            return connection;
        } finally {
            isConnecting = false;
        }
    }

    protected abstract setupInitialCreation(): Promise<void>;

    protected async setupRetryQueue(originalQueue: string, retryDelay = Number(process.env.RETRYDELAY) || 15000) {
        if (!this.channel) return;
        const retryQueue = `${originalQueue}.retry`;
        await this.channel.assertQueue(retryQueue, {
            durable: true,
            messageTtl: retryDelay,
            deadLetterExchange: "",
            deadLetterRoutingKey: originalQueue,
        });
    }

    async setupExchangeQueueAndBind(
        queue: string,
        exchange: string,
        routingKey: string,
        type: ExchangeType = ExchangeTypeEnum.DIRECT,
        headers?: PublishHeadersInterface
    ) {
        if (!this.channel) return;
        try {
            await this.channel.assertExchange(exchange, type, { durable: true, });
            await this.channel.assertQueue(queue, {
                durable: true,
                deadLetterExchange: "",
                deadLetterRoutingKey: `${queue}.dlq`
            });
            await this.channel.assertQueue(`${queue}.dlq`, { durable: true });
            await this.channel.bindQueue(queue, exchange, routingKey, headers);
        } catch (error) {
            this.logger.error("Error while setting up queue:", error);
        }
    }

    async consumeMessages<TPayload = unknown>(
        callback: (data: RabbitMQConsumerMessage<TPayload>) => Promise<void>,
    ) {
        try {
            while (!this.channel) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            await this.channel.consume(
                this.queueName,
                async (msg) => {
                    if (!msg) return;

                    try {
                        const content = JSON.parse(msg.content.toString());
                        await callback(content);
                        this.channel?.ack(msg);
                    } catch (err) {
                        this.logger.error(`Consumer error`, err);

                        const maxTries = Number(process.env.RABBIT_MQ_MAX_TRY) || 5;
                        const maxRequeues = Number(process.env.RABBIT_MQ_MAX_REQUEUE_TRY) || 3;
                        const requeueTry = (msg.properties.headers?.[RetryMechanismHeaderEnum.XREQUEUETRY] || 0) as number;

                        for (let attempt = 1; attempt <= maxTries; attempt++) {
                            try {
                                const content = JSON.parse(msg.content.toString());
                                await callback(content);
                                this.channel?.ack(msg);
                                return;
                            } catch (error) { }
                        }

                        if (requeueTry + 1 < maxRequeues) {
                            const retryQueue = `${this.queueName}.retry`;
                            this.channel?.sendToQueue(retryQueue, msg.content, {
                                persistent: true,
                                headers: { ...msg.properties.headers, [RetryMechanismHeaderEnum.XREQUEUETRY]: requeueTry + 1 },
                            });
                            this.channel?.ack(msg);
                            return;
                        }

                        this.channel?.nack(msg, false, false);
                    }
                },
                { noAck: false },
            );
        } catch (error) {
            this.logger.error("Error while consuming messages:", error);
        }
    }

    async publishToExchange(
        exchange: string,
        routingKey: string,
        message: RabbitMQConsumerMessage,
        headers?: PublishHeadersInterface
    ) {
        if (!this.channel) return;
        try {
            const buffer = Buffer.from(JSON.stringify(message));
            this.channel.publish(exchange, routingKey, buffer, {
                persistent: true,
                headers: { ...headers, [RetryMechanismHeaderEnum.XREQUEUETRY]: 0 },
            });
        } catch (error) {
            this.logger.error("MQ Event Publish Error =>", error);
        }
    }

    async closeChannel() {
        try {
            this.isClosing = true;
            await this.channel?.close();
            this.channel = undefined;
            this.logger.log("RabbitMQ channel closed");
        } catch (error) { }
    }

    static async closeConnection() {
        if (connection) {
            await connection.close();
            connection = undefined;
            Logger.log("RabbitMQ shared connection closed");
        }
    }
}
