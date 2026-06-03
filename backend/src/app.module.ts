import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Common Module
import { BcryptService } from './module/common/infrastruture/services/bcrypt.service';
import { SocketModule } from './module/common/infrastruture/socket/socket.module';
import { RabbitMQModule } from './module/common/infrastruture/rabbit-mq/rabbit-mq.module';
import { AuthenticateMiddleware } from './module/common/infrastruture/middleware/authenticate.middleware';

// User Module
import { userDataSource } from './module/user-module/infrastructure/database/data-source';
import { UserRepository } from './module/user-module/infrastructure/repository/user.repository';
import { JwtHelperService } from './module/user-module/infrastructure/services/jwt.service';
import * as UserCronModule from './module/user-module/infrastructure/cron/cron.module';
import { UserModule } from './module/user-module/feature/user/user.module';

// Catalog Module
import { catalogDataSource } from './module/catalog-module/infrastructure/database/data-source';
import * as ProductProductModule from './module/catalog-module/feature/product/product.module';

// Sale Module
import * as SaleCronModule from './module/sale-module/infrastructure/cron/cron.module';
import { saleDataSource } from './module/sale-module/infrastructure/database/data-source';
import * as SaleOrderModule from './module/sale-module/feature/order/order.module';
import * as SaleProductModule from './module/sale-module/feature/product/product.module';

// Billing Module
import { billingDataSource } from './module/billing-module/infrastructure/database/data-source';
import { WalletModule } from './module/billing-module/feature/wallet/wallet.module';
import * as BillingOrderModule from './module/billing-module/feature/order/order.module';
import * as BillingCronModule from './module/billing-module/infrastructure/cron/cron.module';

// Shipment Module
import { shipmentDataSource } from './module/shipment-module/infrastructure/database/data-source';
import { UserAddressModule } from './module/shipment-module/feature/user/user-address.module';
import * as ShipmentProductModule from './module/shipment-module/feature/product/product.module';
import * as ShipmentOrderModule from './module/shipment-module/feature/order/order.module';
import * as ShipmentCronModule from './module/shipment-module/infrastructure/cron/cron.module';
import { createTransactionalDataSource } from './module/common/infrastruture/services/typeorm.transactional';
import { RazorPayModule } from './module/billing-module/feature/razorpay/get.razor.pay.link.module';

@Module({
  imports: [
    // common
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_REGISTER_SECRET,
      // signOptions: { expiresIn: '60m' },
    }),
    RabbitMQModule,
    ScheduleModule.forRoot(),
    SocketModule,

    //User Modules
    TypeOrmModule.forRootAsync({
      name: process.env.DB_POSTGRES_USER_SCHEMA || 'user_schema',
      useFactory: () => ({
        ...userDataSource.options,
        retryAttempts: 10,
        retryDelay: 5000,
      }),
      dataSourceFactory: async (options) =>
        createTransactionalDataSource(
          process.env.DB_POSTGRES_USER_SCHEMA || 'user_schema',
          options,
        ),
    }),
    UserModule,
    UserCronModule.CronModule,

    // Catalog Modules
    TypeOrmModule.forRootAsync({
      name: process.env.DB_POSTGRES_CATALOG_SCHEMA || 'catalog_schema',
      useFactory: () => ({
        ...catalogDataSource.options,
        retryAttempts: 10,
        retryDelay: 5000,
      }),
      dataSourceFactory: async (options) =>
        createTransactionalDataSource(
          process.env.DB_POSTGRES_CATALOG_SCHEMA || 'catalog_schema',
          options,
        ),
    }),
    ProductProductModule.ProductModule,

    // Sale Modules
    TypeOrmModule.forRootAsync({
      name: process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema',
      useFactory: () => ({
        ...saleDataSource.options,
        retryAttempts: 10,
        retryDelay: 5000,
      }),
      dataSourceFactory: async (options) =>
        createTransactionalDataSource(
          process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema',
          options,
        ),
    }),
    SaleOrderModule.OrderModule,
    SaleCronModule.CronModule,
    SaleProductModule.ProductModule,

    // Billing Modules
    TypeOrmModule.forRootAsync({
      name: process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema',
      useFactory: () => ({
        ...billingDataSource.options,
        retryAttempts: 10,
        retryDelay: 5000,
      }),
      dataSourceFactory: async (options) =>
        createTransactionalDataSource(
          process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema',
          options,
        ),
    }),
    WalletModule,
    BillingOrderModule.OrderModule,
    BillingCronModule.CronModule,
    RazorPayModule,

    // shipment Modules
    TypeOrmModule.forRootAsync({
      name: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
      useFactory: () => ({
        ...shipmentDataSource.options,
        retryAttempts: 10,
        retryDelay: 5000,
      }),
      dataSourceFactory: async (options) =>
        createTransactionalDataSource(
          process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
          options,
        ),
    }),
    UserAddressModule,
    ShipmentProductModule.ProductModule,
    ShipmentOrderModule.OrderModule,
    ShipmentCronModule.CronModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserRepository, JwtHelperService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .exclude(
        { path: '/user/login', method: RequestMethod.ALL },
        { path: '/user/register', method: RequestMethod.ALL },
        { path: '/*path/product', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}