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
import * as BillingInboxRepo from 'src/module/billing-module/infrastructure/repository/inbox.repository';
import * as BillingOrderRepo from 'src/module/billing-module/infrastructure/repository/order.repository';
import * as BillingUserRegisterService from 'src/module/billing-module/feature/user/user-register/user-register.service';
import * as BillingOrderCreatedService from 'src/module/billing-module/feature/order/order-created/order-created.handler';
import * as BillingUserRegisteredConsumer from 'src/module/billing-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as BillingOrderCreatedConsumer from 'src/module/billing-module/infrastructure/rabbit-mq-consumer/order/order-created/order-created.consumer';

// Shipment Module
import * as ShipmentInboxRepo from 'src/module/shipment-module/infrastructure/repository/inbox.repository';
import * as ShipmentUserRepo from 'src/module/shipment-module/infrastructure/repository/user.repository';
import * as ShipmentOrderRepo from 'src/module/shipment-module/infrastructure/repository/order.repository';
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
        BillingInboxRepo.InboxRepository,
        BillingOrderRepo.OrderRepository,
        BillingUserRegisterService.UserRegisterService,
        BillingOrderCreatedService.OrderCreatedService,
        BillingUserRegisteredConsumer.UserRegisteredConsumer,
        BillingOrderCreatedConsumer.OrderCreatedConsumer,

        // Shipment Module
        ShipmentUserRepo.UserRepository,
        ShipmentOrderRepo.OrderRepository,
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