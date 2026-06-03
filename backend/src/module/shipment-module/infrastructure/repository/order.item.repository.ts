import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { OrderItemEntity } from "../../domain/order-item/order-item.entity";

@Injectable()
export class OrderItemRepository extends Repository<OrderItemEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema')
        private readonly dataSource: DataSource,
    ) {
        super(OrderItemEntity, dataSource.createEntityManager());
    }

    async createOrderItem(body: Partial<OrderItemEntity>) {
        const item = this.create(body);
        return await this.save(item);
    }
}
