import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { EventHandlerMapService } from './event-handler.map.service';
import { SaleRabbitMQConsumerInitializer } from './rabbit-mq-consumer-initializer';
import { UserRegisteredService } from '../../feature/user/user-registered/user-registered.handler';
import { OrderBilledService } from '../../feature/order/order-billed/order-billed.handler';
import { OrderRefundService } from '../../feature/order/order-refund/order-refund.handler';
import { OrderPaymentFailedService } from '../../feature/order/order-payment-failed/order-payment-failed.handler';
import { OrderShippingLabelCreatedService } from '../../feature/order/order-shipping-label-created/order-shipping-label-created.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { UserRepository } from '../repository/user.repository';
import { OrderRepository } from '../repository/order.repository';

@Module({
    providers: [
        RabbitMQService,
        SaleRabbitMQConsumerInitializer,
        EventHandlerMapService,
        UserRegisteredService,
        OrderBilledService,
        OrderRefundService,
        OrderPaymentFailedService,
        OrderShippingLabelCreatedService,
        InboxRepository,
        UserRepository,
        OrderRepository,
    ],
    exports: [RabbitMQService, EventHandlerMapService],
})
export class SaleRabbitMQModule { }
