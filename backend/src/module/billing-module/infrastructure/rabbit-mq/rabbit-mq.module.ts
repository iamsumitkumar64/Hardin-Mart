import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { BillingEventHandlerMap } from './billing-event-handler.map';
import { BillingRabbitMQConsumerInitializer } from './billing-rabbit-mq-consumer-initializer';

@Module({
    providers: [RabbitMQService, BillingEventHandlerMap, BillingRabbitMQConsumerInitializer],
    exports: [RabbitMQService, BillingEventHandlerMap],
})
export class BillingRabbitMQModule { }
