import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { CatalogEventHandlerMap } from './catalog-event-handler.map';
import { CatalogRabbitMQConsumerInitializer } from './catalog-rabbit-mq-consumer-initializer';

@Module({
    providers: [RabbitMQService, CatalogEventHandlerMap, CatalogRabbitMQConsumerInitializer],
    exports: [RabbitMQService, CatalogEventHandlerMap],
})
export class CatalogRabbitMQModule { }
