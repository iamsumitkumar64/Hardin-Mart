import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";
import { OrderItemRepository } from "src/module/shipment-module/infrastructure/repository/order.item.repository";
import { Transactional } from "typeorm-transactional";
import type { OrderCreatedMQEventPayload } from "src/module/shipment-module/infrastructure/rabbit-mq/rabbit-mq.type";

@Injectable()
export class CreateOrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderItemRepository: OrderItemRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
    })
    async handle(order: OrderCreatedMQEventPayload) {
        const shipmentOrder = await this.orderRepository.createOrder(
            {
                customer_uuid: order.customer_uuid,
                uuid: order.order_uuid,
                id: order.order_id,
                created_at: order.created_at,
                address_uuid: order.address_uuid,
            }
        );

        const orderItems = await Promise.all(
            order.items.map((item) =>
                this.orderItemRepository.createOrderItem({
                    order_uuid: shipmentOrder.uuid,
                    product_uuid: item.product_uuid,
                    quantity: item.quantity
                })
            )
        );
        shipmentOrder.items = orderItems;

        return;
    }
}