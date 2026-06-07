import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import amqp, { Channel, ChannelModel } from "amqplib";
import { ExchangeType, PublishHeadersInterface } from "./type-enum/rabbit-mq.type";
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RetryMechanismHeaderEnum, RoutingKeyEnum } from "./type-enum/rabbit-mq.enum";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private channel?: Channel;
    private connection?: ChannelModel;
    private readonly logger = new Logger(RabbitMQService.name);
    private isConnecting = false;
    private isClosing = false;

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
            // create connection then i can create multiple channels
            this.connection = await amqp.connect(process.env.RABBIT_MQ_URL ?? "amqp://localhost:5672");
            this.channel = await this.connection.createChannel();
            await this.setupInitialCreation();

            // fair dispatch means at one time a channel can hold 5 unacknowledged msg with 6th will pass on to another channel
            await this.channel.prefetch(5);

            // checking channel connection
            this.channel.on('error', (err: any) => {
                this.logger.error('Channel error', err);
            });

            // reconnect if connection closed
            this.connection.on("close", () => {
                this.connection = undefined;
                this.channel = undefined;
                if (this.isClosing) return;

                this.logger.warn("Connection closed, reconnecting...");
                setTimeout(() => this.connectToRabbitMQ(), 1000);
            });

            this.logger.log("Connected to RabbitMQ and created the channel");
        } catch (error) {
            this.logger.error("Error connecting to RabbitMQ:", error);
        } finally {
            this.isConnecting = false;
        }
    }

    private async setupInitialCreation() {
        const channel = this.channel;
        if (!channel) return;

        // catalog user registered queue
        await this.setupExchangeQueueAndBind(
            QueueEnum.CATALOG_USER_REGISTERED_QUEUE,
            ExchangeNameEnum.USER_EXCHANGE,
            RoutingKeyEnum.USER_REGISTERED,
            ExchangeTypeEnum.DIRECT,
        );
        await this.setupRetryQueue(QueueEnum.CATALOG_USER_REGISTERED_QUEUE);

        // sale user registered queue
        await this.setupExchangeQueueAndBind(
            QueueEnum.SALE_USER_REGISTERED_QUEUE,
            ExchangeNameEnum.USER_EXCHANGE,
            RoutingKeyEnum.USER_REGISTERED,
            ExchangeTypeEnum.DIRECT,
        );
        await this.setupRetryQueue(QueueEnum.SALE_USER_REGISTERED_QUEUE);

        // billing user registered queue
        await this.setupExchangeQueueAndBind(
            QueueEnum.BILLING_USER_REGISTERED_QUEUE,
            ExchangeNameEnum.USER_EXCHANGE,
            RoutingKeyEnum.USER_REGISTERED,
            ExchangeTypeEnum.DIRECT,
        );
        await this.setupRetryQueue(QueueEnum.BILLING_USER_REGISTERED_QUEUE);

        // shipment user registered queue
        await this.setupExchangeQueueAndBind(
            QueueEnum.SHIPMENT_USER_REGISTERED_QUEUE,
            ExchangeNameEnum.USER_EXCHANGE,
            RoutingKeyEnum.USER_REGISTERED,
            ExchangeTypeEnum.DIRECT,
        );
        await this.setupRetryQueue(QueueEnum.SHIPMENT_USER_REGISTERED_QUEUE);

        // billing order created queue
        await this.setupExchangeQueueAndBind(
            QueueEnum.BILLING_ORDER_CREATED_QUEUE,
            ExchangeNameEnum.ORDER_EXCHANGE,
            RoutingKeyEnum.ORDER_CREATED,
            ExchangeTypeEnum.DIRECT,
        );
        await this.setupRetryQueue(QueueEnum.BILLING_ORDER_CREATED_QUEUE);

        // shipment order created queue
        await this.setupExchangeQueueAndBind(
            QueueEnum.SHIPMENT_ORDER_CREATED_QUEUE,
            ExchangeNameEnum.ORDER_EXCHANGE,
            RoutingKeyEnum.ORDER_CREATED,
            ExchangeTypeEnum.DIRECT,
        );
        await this.setupRetryQueue(QueueEnum.SHIPMENT_ORDER_CREATED_QUEUE);

        // shipment order paid queue
        await this.setupExchangeQueueAndBind(
            QueueEnum.SHIPMENT_ORDER_PAID_QUEUE,
            ExchangeNameEnum.ORDER_EXCHANGE,
            RoutingKeyEnum.ORDER_PAID,
            ExchangeTypeEnum.DIRECT,
        );
        await this.setupRetryQueue(QueueEnum.SHIPMENT_ORDER_PAID_QUEUE);

        // billing order refund queue
        await this.setupExchangeQueueAndBind(
            QueueEnum.BILLING_ORDER_REFUND_QUEUE,
            ExchangeNameEnum.ORDER_EXCHANGE,
            RoutingKeyEnum.ORDER_REFUND,
            ExchangeTypeEnum.DIRECT,
        );
        await this.setupRetryQueue(QueueEnum.BILLING_ORDER_REFUND_QUEUE);

        // billing order created now pay queue
        await this.setupExchangeQueueAndBind(
            QueueEnum.BILLING_ORDER_CREATED_PAY_QUEUE,
            ExchangeNameEnum.ORDER_EXCHANGE,
            RoutingKeyEnum.BILLING_ORDER_CREATED,
            ExchangeTypeEnum.DIRECT,
        );
        await this.setupRetryQueue(QueueEnum.BILLING_ORDER_CREATED_PAY_QUEUE);
    }

    private async setupRetryQueue(originalQueue: string, retryDelay = Number(process.env.RETRYDELAY) || 15000) {
        const channel = this.channel;
        if (!channel) return;

        const retryQueue = `${originalQueue}.retry`;

        await channel.assertQueue(retryQueue, {
            durable: true,
            messageTtl: retryDelay, // delay before retry
            deadLetterExchange: "", // back to default exchange
            deadLetterRoutingKey: originalQueue, // send back to original queue after TTL
        });
    }

    // insert exchange + insert queue -> bind both
    async setupExchangeQueueAndBind(
        queue: string,
        exchange: string,
        routingKey: string,
        type: ExchangeType = ExchangeTypeEnum.DIRECT,
        headers?: PublishHeadersInterface
    ) {
        try {
            const channel = this.channel;
            if (!channel) return;

            // ensure exchange + queue
            await channel.assertExchange(exchange, type, { durable: true, });
            await channel.assertQueue(
                queue,
                {
                    durable: true,
                    deadLetterExchange: "",
                    deadLetterRoutingKey: `${queue}.dlq`
                }
            );
            await channel.assertQueue(`${queue}.dlq`, { durable: true });

            // bind queue to exchange
            await channel.bindQueue(queue, exchange, routingKey, headers);
        } catch (error) {
            this.logger.error("Error while setting up queue:", error);
        }
    }

    // consume messages
    async consumeMessages<TPayload = unknown>(
        queue: string,
        callback: (data: TPayload) => Promise<void>,
    ) {
        try {
            while (!this.channel) {
                this.logger.warn('Waiting for RabbitMQ channel...');
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            const channel = this.channel;
            if (!channel) return;

            await channel.consume(
                queue,
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

                        // Chance 1: if working locally inside a processing try chance
                        for (let attempt = 1; attempt <= maxTries; attempt++) {
                            try {
                                const content = JSON.parse(msg.content.toString());
                                this.logger.warn(`Retry processing attempt ${attempt}/${maxTries}`,);

                                await callback(content);
                                channel.ack(msg);
                                return;
                            } catch (error) {
                                if (attempt === maxTries) {
                                    this.logger.error(`Local retry failed after ${maxTries} attempts`,);
                                }
                            }
                        }

                        // Chance 2: if working inside a requeue try chance
                        if (requeueTry + 1 < maxRequeues) {
                            this.logger.warn(`Requeue cycle ${requeueTry + 1}/${maxRequeues}`,);
                            const retryQueue = `${queue}.retry`;

                            channel.sendToQueue(
                                retryQueue, //queue,
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
                            // channel.nack(msg, false, true); // requeue automatically
                            this.logger.warn(`Message sent to retry queue ${retryQueue}, attempt ${requeueTry + 1}/${maxRequeues}`);
                            return;
                        }

                        // Chance 3: if exhausted all chance of max-try and max-requeue-try
                        this.logger.error(`Message failed after ${maxRequeues} requeues × ${maxTries} tries`,);
                        channel.nack(msg, false, false); // reject and put in dlq if exists
                    }
                },
                { noAck: false },
            );
        } catch (error) {
            this.logger.error("Error while consuming messages:", error);
        }
    }

    // send message using exchange
    async publishToExchange(
        exchange: string,
        routingKey: string,
        message: unknown,
        // type: ExchangeType = ExchangeTypeEnum.DIRECT,
        headers?: PublishHeadersInterface
    ) {
        try {
            const channel = this.channel;
            if (!channel) return;

            // ensure exchange exists
            // await this.channel.assertExchange(exchange, type, { durable: true, });

            // amqp is binary protocol on tcp so send in binary format
            const buffer = Buffer.from(JSON.stringify(message));

            // publish message
            channel.publish(exchange, routingKey, buffer, {
                persistent: true,
                headers: {
                    ...headers,
                    [RetryMechanismHeaderEnum.XREQUEUETRY]: 0,
                },
            });

            this.logger.log(`Sent => exchange = ${exchange} | key = ${routingKey}`);
        } catch (error) {
            this.logger.error("Send error:", error);
        }
    }

    async closeConnection() {
        try {
            this.isClosing = true;

            // close channel + connection
            await this.channel?.close();
            await this.connection?.close();

            this.logger.log("RabbitMQ connection closed");
        } catch (error) {
            this.logger.error("Error closing RabbitMQ connection:", error);
        }
    }
}
