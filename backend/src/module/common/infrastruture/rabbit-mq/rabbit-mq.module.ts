import { Global, Module } from '@nestjs/common';
// Common Service
import { RabbitMQService } from './rabbit-mq.service';

// User Module
import * as UserUserRepository from 'src/module/user-module/infrastructure/repository/user.repository';

// Catalog Module
import * as CatalogUserRepository from 'src/module/catalog-module/infrastructure/repository/user.repository';
import * as CatalogInboxRepository from 'src/module/catalog-module/infrastructure/repository/inbox.repository';
import * as CatalogUserRegisteredConsumer from 'src/module/catalog-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as CatalogUserRegisterHandler from 'src/module/catalog-module/feature/user/user-register/user-register.handler';

// Sale Module
import * as SaleUserRepository from 'src/module/sale-module/infrastructure/repository/user.repository';
import * as SaleInboxRepository from 'src/module/sale-module/infrastructure/repository/inbox.repository';
import * as SaleUserRegisteredConsumer from 'src/module/sale-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as SaleUserRegisterHandler from 'src/module/sale-module/feature/user/user-register/user-register.handler';

// Billing Module
import * as BillingUserRepo from 'src/module/billing-module/infrastructure/repository/user.repository';
import * as BillingOutboxRepo from 'src/module/billing-module/infrastructure/repository/outbox.repository';
import * as BillingInboxRepo from 'src/module/billing-module/infrastructure/repository/inbox.repository';
import * as BillingOrderRepo from 'src/module/billing-module/infrastructure/repository/order.repository';
import * as BillingWalletRepo from 'src/module/billing-module/infrastructure/repository/wallet.repository';
import * as BillingWalletHistoryRepo from 'src/module/billing-module/infrastructure/repository/wallet.history.repository';
import * as BillingUserRegisterService from 'src/module/billing-module/feature/user/user-register/user-register.handler';
import * as BillingPayOrderService from 'src/module/billing-module/feature/wallet/pay-order/pay-order.handler';
import * as BillingOrderCreatedService from 'src/module/billing-module/feature/order/order-created/order-created.handler';
import * as BillingOrderRefundService from 'src/module/billing-module/feature/order/order-refund/order-refund.handler';
import * as BillingOrderCreatedPayConsumer from 'src/module/billing-module/infrastructure/rabbit-mq-consumer/order/order-created-pay/order-created-pay.consumer';
import * as BillingUserRegisteredConsumer from 'src/module/billing-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as BillingOrderCreatedConsumer from 'src/module/billing-module/infrastructure/rabbit-mq-consumer/order/order-created/order-created.consumer';
import * as BillingOrderRefundConsumer from 'src/module/billing-module/infrastructure/rabbit-mq-consumer/order/order-refund/order-refund.consumer';

// Shipment Module
import * as ShipmentInboxRepo from 'src/module/shipment-module/infrastructure/repository/inbox.repository';
import * as ShipmentUserRepo from 'src/module/shipment-module/infrastructure/repository/user.repository';
import * as ShipmentOrderRepo from 'src/module/shipment-module/infrastructure/repository/order.repository';
import * as ShipmentOrderItemRepo from 'src/module/shipment-module/infrastructure/repository/order.item.repository';
import * as ShipmentProductRepo from 'src/module/shipment-module/infrastructure/repository/product.repository';
import * as ShipmentOutboxRepo from 'src/module/shipment-module/infrastructure/repository/outbox.repository';
import * as ShipmentUserRegisterService from 'src/module/shipment-module/feature/user/user-register/user-register.handler';
import * as ShipmentOrderCreatedService from 'src/module/shipment-module/feature/order/order-created/order-created.handler';
import * as ShipmentOrderPaidService from 'src/module/shipment-module/feature/order/order-paid/order-paid.handler';
import * as ShipmentUserRegisteredConsumer from 'src/module/shipment-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as ShipmentOrderCreatedConsumer from 'src/module/shipment-module/infrastructure/rabbit-mq-consumer/order/order-created/order-created.consumer';
import * as ShipmentOrderPaidConsumer from 'src/module/shipment-module/infrastructure/rabbit-mq-consumer/order/order-paid/order-paid.consumer';

@Global()
@Module({
    imports: [],
    providers: [
        // Common Service
        RabbitMQService,

        // User Module
        UserUserRepository.UserRepository,

        // Catalog Module
        CatalogUserRepository.UserRepository,
        CatalogInboxRepository.InboxRepository,
        CatalogUserRegisteredConsumer.UserRegisteredConsumer,
        CatalogUserRegisterHandler.UserRegisterService,

        // Sale Module
        SaleUserRepository.UserRepository,
        SaleInboxRepository.InboxRepository,
        SaleUserRegisteredConsumer.UserRegisteredConsumer,
        SaleUserRegisterHandler.UserRegisterService,

        // Billing Module
        BillingUserRepo.UserRepository,
        BillingOutboxRepo.OutboxRepository,
        BillingInboxRepo.InboxRepository,
        BillingOrderRepo.OrderRepository,
        BillingWalletRepo.WalletRepository,
        BillingWalletHistoryRepo.WalletHistoryRepository,
        BillingUserRegisterService.UserRegisterService,
        BillingOrderCreatedService.OrderCreatedService,
        BillingPayOrderService.PayOrderService,
        BillingOrderRefundService.OrderRefundService,
        BillingUserRegisteredConsumer.UserRegisteredConsumer,
        BillingOrderCreatedConsumer.OrderCreatedConsumer,
        BillingOrderCreatedPayConsumer.OrderCreatedPayConsumer,
        BillingOrderRefundConsumer.OrderRefundConsumer,

        // Shipment Module
        ShipmentUserRepo.UserRepository,
        ShipmentOrderRepo.OrderRepository,
        ShipmentOrderItemRepo.OrderItemRepository,
        ShipmentProductRepo.ProductRepository,
        ShipmentOutboxRepo.OutboxRepository,
        ShipmentInboxRepo.InboxRepository,
        ShipmentUserRegisterService.UserRegisterService,
        ShipmentOrderCreatedService.OrderCreatedService,
        ShipmentOrderPaidService.OrderPaidService,
        ShipmentUserRegisteredConsumer.UserRegisteredConsumer,
        ShipmentOrderCreatedConsumer.OrderCreatedConsumer,
        ShipmentOrderPaidConsumer.OrderPaidConsumer,
    ],
    exports: [RabbitMQService],
})
export class RabbitMQModule { }