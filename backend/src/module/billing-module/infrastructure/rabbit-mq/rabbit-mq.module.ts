import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { EventHandlerMapService } from './event-handler.map.service';
import { BillingRabbitMQConsumerInitializer } from './rabbit-mq-consumer-initializer';
import { UserRegisteredService } from '../../feature/user/user-registered/user-registered.handler';
import { OrderPlacedService } from '../../feature/order/order-placed/order-placed.handler';
import { OrderRefundService } from '../../feature/order/order-refund/order-refund.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { UserRepository } from '../repository/user.repository';
import { WalletRepository } from '../repository/wallet.repository';
import { WalletHistoryRepository } from '../repository/wallet.history.repository';
import { OrderRepository } from '../repository/order.repository';
import { OutboxRepository } from '../repository/outbox.repository';

@Module({
    providers: [
        RabbitMQService,
        BillingRabbitMQConsumerInitializer,
        EventHandlerMapService,
        UserRegisteredService,
        OrderPlacedService,
        OrderRefundService,
        InboxRepository,
        OutboxRepository,
        OrderRepository,
        UserRepository,
        WalletRepository,
        WalletHistoryRepository,
    ],
    exports: [RabbitMQService, EventHandlerMapService],
})
export class BillingRabbitMQModule { }
