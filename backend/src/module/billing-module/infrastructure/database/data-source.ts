//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { InboxEntity } from "../../domain/inbox/inbox.entity";
import { UserEntity } from "../../domain/user/user.entity";
import { WalletEntity } from "../../domain/wallet/wallet.entity";
import { WalletHistoryEntity } from "../../domain/wallet-history/wallet-history.entity";
import { OutboxEntity } from "../../domain/outbox/outbox.entity";
import { OrderEntity } from "../../domain/order/order.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity, InboxEntity, OutboxEntity,
        WalletEntity, WalletHistoryEntity,
        OrderEntity,
    ],
    schema: process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema',
    synchronize: false,
    migrations: ['dist/module/billing-module/infrastructure/database/migrations/*{.ts,.js}'],
};

const billingDataSource = new DataSource(options);

export { billingDataSource, options };