import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { EventHandlerMapService } from './event-handler.map.service';
import { ShipmentRabbitMQConsumerInitializer } from './rabbit-mq-consumer-initializer';
import { UserRegisteredService } from '../../feature/user/user-registered/user-registered.handler';
import { OrderPlacedService } from '../../feature/order/order-placed/order-placed.handler';
import { OrderBilledService } from '../../feature/order/order-billed/order-billed.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { UserRepository } from '../repository/user.repository';
import { OrderRepository } from '../repository/order.repository';
import { ProductRepository } from '../repository/product.repository';
import { OutboxRepository } from '../repository/outbox.repository';
import { ShippingPolicyService } from '../policy/shipping/shipping.policy.service';

@Module({
    providers: [
        RabbitMQService,
        ShipmentRabbitMQConsumerInitializer,
        EventHandlerMapService,
        ShippingPolicyService,
        UserRegisteredService,
        OrderPlacedService,
        OrderBilledService,
        InboxRepository,
        OutboxRepository,
        UserRepository,
        OrderRepository,
        ProductRepository,
    ],
    exports: [RabbitMQService, EventHandlerMapService],
})
export class ShipmentRabbitMQModule { }
