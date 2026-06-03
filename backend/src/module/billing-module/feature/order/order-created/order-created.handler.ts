import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import type { OrderCreatedMQEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class OrderCreatedService {
    constructor(
        private readonly orderRepository: OrderRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema',
    })
    async handle(order: OrderCreatedMQEventPayload) {
        await this.orderRepository.createOrder(
            {
                user_uuid: order.user_uuid,
                uuid: order.order_uuid,
                id: order.order_id,
                created_at: order.created_at,
                total_price: order.total_price
            }
        );
        return;
    }
}