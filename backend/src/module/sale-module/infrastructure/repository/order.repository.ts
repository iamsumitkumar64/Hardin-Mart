import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { OrderEntity } from "../../domain/order/order.entity";
import { UserEntity } from "../../domain/user/user.entity";
import { OrderStatusEnum } from "../../domain/order/order.enum";

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema')
        private readonly dataSource: DataSource,
    ) {
        super(OrderEntity, dataSource.createEntityManager());
    }

    async createOrder(body: Partial<OrderEntity>) {
        const order = this.create(body);
        return await this.save(order);
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

    async findByUserUuidAndOrderUuid(customer_uuid: string, order_uuid: string) {
        const user = await this.findOne({
            where: {
                uuid: order_uuid,
                customer_uuid: customer_uuid
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
            where: { customer_uuid: user.uuid },
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

    async updateOrderStatus(uuid: string, status: OrderStatusEnum) {
        return await this.update(
            {
                uuid: uuid
            },
            {
                order_status: status
            }
        )
    }
}