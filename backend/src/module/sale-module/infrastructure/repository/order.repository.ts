import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { OrderEntity } from "../../domain/order/order.entity";
import { UserEntity } from "../../domain/user/user.entity";

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema')
        private readonly dataSource: DataSource,
    ) {
        super(OrderEntity, dataSource.createEntityManager());
    }

    async createOrder(body: Partial<OrderEntity>) {
        const user = this.create(body);
        return await this.save(user);
    }

    async findByUuid(uuid: string) {
        const user = await this.findOne({
            where: {
                uuid: uuid
            },
            relations: {
                items: true,
                user: true,
            }
        });
        return user;
    }

    async findByUserUuidAndOrderUuid(user_uuid: string, order_uuid: string) {
        const user = await this.findOne({
            where: {
                uuid: order_uuid,
                user_uuid: user_uuid
            },
            relations: {
                items: true,
                user: true,
            }
        });
        return user;
    }

    async getOrderListing(user: UserEntity, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: { user_uuid: user.uuid },
            relations: {
                items: true,
            },
            order: {
                created_at: 'DESC'
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }
}