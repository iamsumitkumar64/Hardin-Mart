import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { SaleEventHandlerMap } from './sale-event-handler.map';
import { SaleRabbitMQConsumerInitializer } from './sale-rabbit-mq-consumer-initializer';

@Module({
    providers: [RabbitMQService, SaleEventHandlerMap, SaleRabbitMQConsumerInitializer],
    exports: [RabbitMQService, SaleEventHandlerMap],
})
export class SaleRabbitMQModule { }
