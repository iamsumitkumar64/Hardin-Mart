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
import { OrderModule } from './module/sale-module/feature/order/order.module';
import * as SaleProductModule from './module/sale-module/feature/product/product.module';

// Billing Module
import { billingDataSource } from './module/billing-module/infrastructure/database/data-source';
import { WalletModule } from './module/billing-module/feature/wallet/wallet.module';
import * as billingOrderModule from './module/billing-module/feature/order/order.module';
import * as billingCronModule from './module/billing-module/infrastructure/cron/cron.module';

// Shipment Module
import { shipmentDataSource } from './module/shipment-module/infrastructure/database/data-source';
import { UserAddressModule } from './module/shipment-module/feature/user/user-address.module';
import * as ShipmentProductModule from './module/shipment-module/feature/product/product.module';
import * as ShipmentOrderModule from './module/shipment-module/feature/order/order.module';

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
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_USER_SCHEMA || 'user_schema',
      ...userDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    UserModule,
    UserCronModule.CronModule,

    // Catalog Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_CATALOG_SCHEMA || 'catalog_schema',
      ...catalogDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    ProductProductModule.ProductModule,

    // Sale Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema',
      ...saleDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    OrderModule,
    SaleCronModule.CronModule,
    SaleProductModule.ProductModule,

    // billing Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_billing_SCHEMA || 'billing_schema',
      ...billingDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    WalletModule,
    billingOrderModule.OrderModule,
    billingCronModule.CronModule,

    // shipment Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
      ...shipmentDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    UserAddressModule,
    ShipmentProductModule.ProductModule,
    ShipmentOrderModule.OrderModule,
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