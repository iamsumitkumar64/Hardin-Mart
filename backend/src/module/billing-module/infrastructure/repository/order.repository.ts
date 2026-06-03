import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { OrderEntity } from "../../domain/order/order.entity";
import { UserEntity } from "../../domain/user/user.entity";
import { OrderPaymentStatusEnum } from "../../domain/order/order.enum";

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema')
        private readonly dataSource: DataSource,
    ) {
        super(OrderEntity, dataSource.createEntityManager());
    }

    async createOrder(body: Partial<OrderEntity>) {
        const order = this.create(body);
        return await this.save(order);
    }

    async findByUuid(uuid: string) {
        const order = await this.findOne({
            where: {
                uuid: uuid
            },
            relations: {
                user: true,
            }
        });
        return order;
    }

    async findByUserUuidAndOrderUuid(user_uuid: string, order_uuid: string) {
        const order = await this.findOne({
            where: {
                uuid: order_uuid,
                user_uuid: user_uuid
            },
            relations: {
                user: true,
            }
        });
        return order;
    }

    async getOrderListing(user: UserEntity, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: { user_uuid: user.uuid },
            order: {
                created_at: 'DESC'
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }

    async updateOrderPaymentStatus(uuid: string, status: OrderPaymentStatusEnum) {
        return await this.update(
            {
                uuid: uuid
            },
            {
                payment_status: status
            }
        )
    }
}