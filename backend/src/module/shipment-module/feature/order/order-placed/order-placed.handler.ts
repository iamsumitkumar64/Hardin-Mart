import { Injectable } from "@nestjs/common";
import type { OrderPlacedMQEventPayload, } from "src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";
import { runOnTransactionCommit, Transactional } from "typeorm-transactional";

@Injectable()
export class OrderPlacedService {
    constructor(
        private readonly orderRepository: OrderRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema',
    })
    async handle(order: OrderPlacedMQEventPayload) {
        const orderData = await this.orderRepository.findByUserUuidAndOrderUuid(order.customer_uuid, order.order_uuid);
        if (!orderData) {
            console.log('order not found');
            return;
        }

        await this.orderRepository.updateOrder(order.order_uuid, { is_placed: true });

        return;
    }
}