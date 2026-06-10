import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import amqp, { Channel, ChannelModel } from "amqplib";
import { ExchangeType, PublishHeadersInterface, RabbitMQConsumerMessage } from "./rabbit-mq.type";

enum RetryMechanismHeaderEnum {
    XREQUEUETRY = 'x-requeue-try'
}

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private channel?: Channel;
    private connection?: ChannelModel;
    private readonly logger = new Logger(RabbitMQService.name);
    private isConnecting = false;
    private isClosing = false;

    private readonly CATALOG_QUEUE = 'catalog.queue';
    private readonly USER_EXCHANGE = 'user.exchange';

    async onModuleInit() {
        await this.connectToRabbitMQ();
    }

    async onModuleDestroy() {
        await this.closeConnection();
    }

    async connectToRabbitMQ() {
        if (this.isConnecting || this.channel) return;

        this.isConnecting = true;
        try {
            this.connection = await amqp.connect(process.env.RABBIT_MQ_URL ?? "amqp://localhost:5672");
            this.channel = await this.connection.createChannel();
            await this.setupInitialCreation();

            await this.channel.prefetch(Number(process.env.RABBIT_MQ_PREFETCH_COUNT) || 25);

            this.channel.on('error', (err: any) => {
                this.logger.error('Channel error', err);
            });

            this.connection.on("close", () => {
                this.connection = undefined;
                this.channel = undefined;
                if (this.isClosing) return;

                this.logger.warn("Connection closed, reconnecting...");
                setTimeout(() => this.connectToRabbitMQ(), 1000);
            });

            this.logger.log("Connected to RabbitMQ - Catalog Module");
        } catch (error) {
            this.logger.error("Error connecting to RabbitMQ:", error);
        } finally {
            this.isConnecting = false;
        }
    }

    private async setupInitialCreation() {
        const channel = this.channel;
        if (!channel) return;

        // Setup catalog queue bound to user exchange (fanout - no routing key)
        await this.setupFanoutExchangeAndQueue(
            this.CATALOG_QUEUE,
            this.USER_EXCHANGE,
        );
        await this.setupRetryQueue(this.CATALOG_QUEUE);
    }

    private async setupRetryQueue(originalQueue: string, retryDelay = Number(process.env.RETRYDELAY) || 15000) {
        const channel = this.channel;
        if (!channel) return;

        const retryQueue = `${originalQueue}.retry`;

        await channel.assertQueue(retryQueue, {
            durable: true,
            messageTtl: retryDelay,
            deadLetterExchange: "",
            deadLetterRoutingKey: originalQueue,
        });
    }

    async setupFanoutExchangeAndQueue(
        queue: string,
        exchange: string,
        headers?: PublishHeadersInterface
    ) {
        try {
            const channel = this.channel;
            if (!channel) return;

            // Setup fanout exchange and queue
            await channel.assertExchange(exchange, 'fanout', { durable: true });
            await channel.assertQueue(queue, {
                durable: true,
                deadLetterExchange: "",
                deadLetterRoutingKey: `${queue}.dlq`
            });
            await channel.assertQueue(`${queue}.dlq`, { durable: true });

            // Bind queue to exchange (no routing key for fanout)
            await channel.bindQueue(queue, exchange, '', headers);
        } catch (error) {
            this.logger.error("Error while setting up queue:", error);
        }
    }

    async consumeMessages<TPayload = unknown>(
        callback: (data: RabbitMQConsumerMessage<TPayload>) => Promise<void>,
    ) {
        try {
            while (!this.channel) {
                this.logger.warn('Waiting for RabbitMQ channel...');
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            const channel = this.channel;
            if (!channel) return;

            await channel.consume(
                this.CATALOG_QUEUE,
                async (msg) => {
                    if (!msg) return;

                    try {
                        const content = JSON.parse(msg.content.toString());
                        await callback(content);
                        channel.ack(msg);
                    } catch (err) {
                        this.logger.error(`Consumer error`, err);

                        const maxTries = Number(process.env.RABBIT_MQ_MAX_TRY) || 5;
                        const maxRequeues = Number(process.env.RABBIT_MQ_MAX_REQUEUE_TRY) || 3;
                        const requeueTry = (msg.properties.headers?.[RetryMechanismHeaderEnum.XREQUEUETRY] || 0) as number;

                        // Chance 1: Local retry
                        for (let attempt = 1; attempt <= maxTries; attempt++) {
                            try {
                                const content = JSON.parse(msg.content.toString());
                                this.logger.warn(`Retry processing attempt ${attempt}/${maxTries}`);

                                await callback(content);
                                channel.ack(msg);
                                return;
                            } catch (error) {
                                if (attempt === maxTries) {
                                    this.logger.error(`Local retry failed after ${maxTries} attempts`);
                                }
                            }
                        }

                        // Chance 2: Requeue
                        if (requeueTry + 1 < maxRequeues) {
                            this.logger.warn(`Requeue cycle ${requeueTry + 1}/${maxRequeues}`);
                            const retryQueue = `${this.CATALOG_QUEUE}.retry`;

                            channel.sendToQueue(
                                retryQueue,
                                msg.content,
                                {
                                    persistent: true,
                                    headers: {
                                        ...msg.properties.headers,
                                        [RetryMechanismHeaderEnum.XREQUEUETRY]: requeueTry + 1,
                                    },
                                },
                            );

                            channel.ack(msg);
                            this.logger.warn(`Message sent to retry queue ${retryQueue}, attempt ${requeueTry + 1}/${maxRequeues}`);
                            return;
                        }

                        // Chance 3: Failed
                        this.logger.error(`Message failed after ${maxRequeues} requeues × ${maxTries} tries`);
                        channel.nack(msg, false, false);
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
        message: RabbitMQConsumerMessage,
        headers?: PublishHeadersInterface
    ) {
        try {
            const channel = this.channel;
            if (!channel) return;

            const buffer = Buffer.from(JSON.stringify(message));

            // Fanout publish - no routing key needed
            channel.publish(exchange, '', buffer, {
                persistent: true,
                headers: {
                    ...headers,
                    [RetryMechanismHeaderEnum.XREQUEUETRY]: 0,
                },
            });

            this.logger.log(`Sent => exchange = ${exchange}`);
        } catch (error) {
            this.logger.error("Send error:", error);
        }
    }

    async closeConnection() {
        try {
            this.isClosing = true;

            await this.channel?.close();
            await this.connection?.close();

            this.logger.log("RabbitMQ connection closed - Catalog Module");
        } catch (error) {
            this.logger.error("Error closing RabbitMQ connection:", error);
        }
    }
}
