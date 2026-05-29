//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { InboxEntity } from "../../domain/inbox/inbox.entity";
import { UserEntity } from "../../domain/user/user.entity";
import { OrderEntity } from "../../domain/order/order.entity";
import { OrderItemEntity } from "../../domain/order-item/order-item.entity";
import { OutboxEntity } from "src/module/sale-module/domain/outbox/outbox.entity";
import { ProductEntity } from "../../domain/product/product.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity, InboxEntity, OutboxEntity,
        OrderEntity, OrderItemEntity, ProductEntity
    ],
    schema: process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema',
    synchronize: false,
    migrations: ['dist/module/sale-module/infrastructure/database/migrations/*{.ts,.js}'],
};

const saleDataSource = new DataSource(options);

export { saleDataSource, options };