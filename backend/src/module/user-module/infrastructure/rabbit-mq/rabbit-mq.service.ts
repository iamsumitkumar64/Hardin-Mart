import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { RabbitMQService as CommonRabbitMQService } from "../../../../common/infrastruture/rabbit-mq/rabbit-mq.service";
import { userRabbitMQConfig } from "./rabbit-mq.config";
import { RabbitMQConsumerMessage } from "../../../../common/infrastruture/rabbit-mq/rabbit-mq.type";
import { Channel } from "amqplib";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private channel?: Channel;
    private readonly logger = new Logger(RabbitMQService.name);

    constructor(private readonly commonRabbitMQService: CommonRabbitMQService) { }

    async onModuleInit() {
        try {
            this.channel = await this.commonRabbitMQService.createChannel();
            await this.setupInitialCreation();
        } catch (error) {
            this.logger.error("Failed to initialize RabbitMQ Service", error);
        }
    }

    async onModuleDestroy() {
        await this.channel?.close();
    }

    private async setupInitialCreation() {
        if (!this.channel) return;

        const { queueName, exchanges } = userRabbitMQConfig;

        for (const exchange of exchanges) {
            await this.commonRabbitMQService.setupExchangeQueueAndBind(
                this.channel,
                queueName,
                exchange.name,
                exchange.routingKey,
                exchange.type
            );
        }

        await this.commonRabbitMQService.setupRetryQueue(this.channel, queueName);
    }

    async consumeMessages<TPayload = unknown>(
        callback: (data: RabbitMQConsumerMessage<TPayload>) => Promise<void>,
    ) {
        while (!this.channel) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        await this.commonRabbitMQService.consumeMessages(this.channel, userRabbitMQConfig.queueName, callback);
    }

    async publishToExchange(
        exchange: string,
        routingKey: string,
        message: RabbitMQConsumerMessage,
        headers?: any
    ) {
        while (!this.channel) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        await this.commonRabbitMQService.publishToExchange(this.channel, exchange, routingKey, message, headers);
    }
}
