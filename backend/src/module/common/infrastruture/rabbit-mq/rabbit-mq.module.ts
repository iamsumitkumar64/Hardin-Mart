import { Global, Module } from '@nestjs/common';
// Common Service
import { RabbitMQService } from './rabbit-mq.service';

// User Module
import * as UserUserRepository from 'src/module/user-module/infrastructure/repository/user.repository';

// Catalog Module
import * as CatalogUserRepository from 'src/module/catalog-module/infrastructure/repository/user.repository';
import * as CatalogInboxRepository from 'src/module/catalog-module/infrastructure/repository/inbox.repository';
import * as CatalogUserRegisteredConsumer from 'src/module/catalog-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as CatalogUserRegisterService from 'src/module/catalog-module/feature/user/user-register/user-register.handler';

// Sale Module
import * as SaleUserRepository from 'src/module/sale-module/infrastructure/repository/user.repository';
import * as SaleInboxRepository from 'src/module/sale-module/infrastructure/repository/inbox.repository';
import * as SaleOrderRepository from 'src/module/sale-module/infrastructure/repository/order.repository';
import * as SaleUserRegisteredConsumer from 'src/module/sale-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as SaleUserRegisterService from 'src/module/sale-module/feature/user/user-register/user-register.handler';
import * as SaleOrderBilledService from 'src/module/sale-module/feature/order/order-billed/order-billed.handler';
import * as SaleOrderRefundService from 'src/module/sale-module/feature/order/order-refund/order-refund.handler';
import * as SaleOrderPaymentFailedService from 'src/module/sale-module/feature/order/order-payment-failed/order-payment-failed.handler';
import * as SaleOrderShippingLabelCreatedService from 'src/module/sale-module/feature/order/order-shipping-label-created/order-shipping-label-created.handler';
import * as SaleOrderBilledConsumer from 'src/module/sale-module/infrastructure/rabbit-mq-consumer/order/order-billed/order-billed.consumer';
import * as SaleOrderShippingLabelCreatedConsumer from 'src/module/sale-module/infrastructure/rabbit-mq-consumer/order/order-shipping-label-created/order-shipping-label-created.consumer';
import * as SaleOrderRefundConsumer from 'src/module/sale-module/infrastructure/rabbit-mq-consumer/order/order-refund/order-refund.consumer';
import * as SaleOrderPaymentFailedConsumer from 'src/module/sale-module/infrastructure/rabbit-mq-consumer/order/order-payment-failed/order-payment-failed.consumer';

// Billing Module
import * as BillingUserRepo from 'src/module/billing-module/infrastructure/repository/user.repository';
import * as BillingOutboxRepo from 'src/module/billing-module/infrastructure/repository/outbox.repository';
import * as BillingInboxRepo from 'src/module/billing-module/infrastructure/repository/inbox.repository';
import * as BillingOrderRepo from 'src/module/billing-module/infrastructure/repository/order.repository';
import * as BillingWalletRepo from 'src/module/billing-module/infrastructure/repository/wallet.repository';
import * as BillingWalletHistoryRepo from 'src/module/billing-module/infrastructure/repository/wallet.history.repository';
import * as BillingUserRegisterService from 'src/module/billing-module/feature/user/user-register/user-register.handler';
import * as BillingOrderPlacedService from 'src/module/billing-module/feature/order/order-placed/order-placed.handler';
import * as BillingOrderRefundService from 'src/module/billing-module/feature/order/order-refund/order-refund.handler';
import * as BillingOrderPlacedConsumer from 'src/module/billing-module/infrastructure/rabbit-mq-consumer/order/order-placed/order-placed.consumer';
import * as BillingUserRegisteredConsumer from 'src/module/billing-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as BillingOrderRefundConsumer from 'src/module/billing-module/infrastructure/rabbit-mq-consumer/order/order-refund/order-refund.consumer';

// Shipment Module
import * as ShipmentInboxRepo from 'src/module/shipment-module/infrastructure/repository/inbox.repository';
import * as ShipmentUserRepo from 'src/module/shipment-module/infrastructure/repository/user.repository';
import * as ShipmentOrderRepo from 'src/module/shipment-module/infrastructure/repository/order.repository';
import * as ShipmentOrderItemRepo from 'src/module/shipment-module/infrastructure/repository/order.item.repository';
import * as ShipmentProductRepo from 'src/module/shipment-module/infrastructure/repository/product.repository';
import * as ShipmentOutboxRepo from 'src/module/shipment-module/infrastructure/repository/outbox.repository';
import * as ShipmentUserRegisterService from 'src/module/shipment-module/feature/user/user-register/user-register.handler';
import * as ShipmentOrderPlacedService from 'src/module/shipment-module/feature/order/order-placed/order-placed.handler';
import * as ShipmentOrderBilledService from 'src/module/shipment-module/feature/order/order-billed/order-billed.handler';
import * as ShipmentUserRegisteredConsumer from 'src/module/shipment-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as ShipmentOrderBilledConsumer from 'src/module/shipment-module/infrastructure/rabbit-mq-consumer/order/order-billed/order-billed.consumer';
import * as ShipmentOrderPlacedConsumer from 'src/module/shipment-module/infrastructure/rabbit-mq-consumer/order/order-placed/order-placed.consumer';

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
        CatalogUserRegisterService.UserRegisterService,

        // Sale Module
        SaleUserRepository.UserRepository,
        SaleInboxRepository.InboxRepository,
        SaleOrderRepository.OrderRepository,
        SaleUserRegisteredConsumer.UserRegisteredConsumer,
        SaleOrderShippingLabelCreatedService.OrderShippingLabelCreatedService,
        SaleOrderBilledService.OrderBilledService,
        SaleUserRegisterService.UserRegisterService,
        SaleOrderPaymentFailedService.OrderPaymentFailedService,
        SaleOrderRefundService.OrderRefundService,
        SaleOrderBilledConsumer.OrderBilledConsumer,
        SaleOrderShippingLabelCreatedConsumer.OrderShippingLabelCreatedConsumer,
        SaleOrderRefundConsumer.OrderRefundConsumer,
        SaleOrderPaymentFailedConsumer.OrderPaymentFailedConsumer,

        // Billing Module
        BillingUserRepo.UserRepository,
        BillingOutboxRepo.OutboxRepository,
        BillingInboxRepo.InboxRepository,
        BillingOrderRepo.OrderRepository,
        BillingWalletRepo.WalletRepository,
        BillingWalletHistoryRepo.WalletHistoryRepository,
        BillingUserRegisterService.UserRegisterService,
        BillingOrderPlacedService.OrderPlacedService,
        BillingOrderRefundService.OrderRefundService,
        BillingUserRegisteredConsumer.UserRegisteredConsumer,
        BillingOrderPlacedConsumer.OrderPlacedConsumer,
        BillingOrderRefundConsumer.OrderRefundConsumer,

        // Shipment Module
        ShipmentUserRepo.UserRepository,
        ShipmentOrderRepo.OrderRepository,
        ShipmentOrderItemRepo.OrderItemRepository,
        ShipmentProductRepo.ProductRepository,
        ShipmentOutboxRepo.OutboxRepository,
        ShipmentInboxRepo.InboxRepository,
        ShipmentUserRegisterService.UserRegisterService,
        ShipmentOrderBilledService.OrderBilledService,
        ShipmentOrderPlacedService.OrderPlacedService,
        ShipmentUserRegisteredConsumer.UserRegisteredConsumer,
        ShipmentOrderBilledConsumer.OrderBilledConsumer,
        ShipmentOrderPlacedConsumer.OrderPlacedConsumer,
    ],
    exports: [RabbitMQService],
})
export class RabbitMQModule { }