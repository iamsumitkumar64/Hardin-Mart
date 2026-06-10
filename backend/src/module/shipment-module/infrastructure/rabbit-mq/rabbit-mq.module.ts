import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { ShipmentEventHandlerMap } from './shipment-event-handler.map';
import { ShipmentRabbitMQConsumerInitializer } from './shipment-rabbit-mq-consumer-initializer';

@Module({
    providers: [RabbitMQService, ShipmentEventHandlerMap, ShipmentRabbitMQConsumerInitializer],
    exports: [RabbitMQService, ShipmentEventHandlerMap],
})
export class ShipmentRabbitMQModule { }
