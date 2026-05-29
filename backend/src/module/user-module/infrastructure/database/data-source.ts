//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { UserEntity } from "src/module/user-module/domain/user/user.entity";
import { OutboxEntity } from "../../domain/outbox/outbox.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity, OutboxEntity
    ],
    schema: process.env.DB_POSTGRES_USER_SCHEMA || 'user_schema',
    synchronize: false,
    migrations: ['dist/module/user-module/infrastructure/database/migrations/*{.ts,.js}'],
};

const userDataSource = new DataSource(options);

export { userDataSource, options };