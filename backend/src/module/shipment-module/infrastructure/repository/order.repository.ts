import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { OrderEntity } from "../../domain/order/order.entity";
import { UserEntity } from "../../domain/user/user.entity";
import { OrderListingViewEntity } from "../../domain/order/order-listing.view.entity";

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema')
        private readonly dataSource: DataSource,
    ) {
        super(OrderEntity, dataSource.createEntityManager());
    }

    async createOrder(body: Partial<OrderEntity>) {
        const order = this.create(body);
        return await this.save(order);
    }

    async getOrderListing(user: UserEntity, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: { customer_uuid: user.uuid },
            relations: {
                address: true,
            },
            order: {
                created_at: 'DESC'
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }

    async updateOrder(uuid: string, where: Partial<OrderEntity>) {
        return await this.update(
            {
                uuid: uuid,
            },
            where
        )
    }

    async findByUserUuidAndOrderUuid(customer_uuid: string, order_uuid: string) {
        const user = await this.findOne({
            where: {
                uuid: order_uuid,
                customer_uuid: customer_uuid
            },
            relations: {
                user: true,
                items: true,
            }
        });
        return user;
    }

    async getOrderListingFromMaterializedView(offset?: number, limit?: number) {
        const shipmentSchema = process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema';
        const orderView = process.env.DB_POSTGRES_ORDER_VIEW || "order_listing_mv";
        const currOffset = Number(offset) || Number(process.env.page_offset) || 0;
        const currLimit = Number(limit) || Number(process.env.page_limit) || 10;

        await this.dataSource.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${shipmentSchema}.${orderView}`);

        const [data, total] = await this.dataSource.getRepository(OrderListingViewEntity).findAndCount({
            relations: {
                address: true,
                items: true
            },
            order: {
                created_at: 'DESC'
            },
            skip: currOffset,
            take: currLimit
        });

        return { data, total };
    }
}