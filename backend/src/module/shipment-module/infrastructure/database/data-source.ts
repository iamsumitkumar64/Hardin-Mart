//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { InboxEntity } from "../../domain/inbox/inbox.entity";
import { UserEntity } from "../../domain/user/user.entity";
import { UserAddressEntity } from "../../domain/user_address/user.address.entity";
import { OrderEntity } from "../../domain/order/order.entity";
import { OutboxEntity } from "../../domain/outbox/outbox.entity";
import { ProductEntity } from "../../domain/product/product.entity";
import { OrderItemEntity } from "../../domain/order-item/order-item.entity";
import { ProductListingViewEntity } from "../../domain/product/product-listing.view.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity, InboxEntity, OutboxEntity,
        UserAddressEntity, OrderEntity, ProductEntity,
        OrderItemEntity, ProductListingViewEntity,
    ],
    schema: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
    synchronize: false,
    migrations: ['dist/module/shipment-module/infrastructure/database/migrations/*{.ts,.js}'],
};

const shipmentDataSource = new DataSource(options);

export { shipmentDataSource, options };