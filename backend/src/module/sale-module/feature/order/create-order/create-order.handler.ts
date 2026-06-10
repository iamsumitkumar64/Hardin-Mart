import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./create-order.dto";
import { OrderRepository } from "src/module/sale-module/infrastructure/repository/order.repository";
import { OrderItemRepository } from "src/module/sale-module/infrastructure/repository/order.item.repository";
import { Transactional } from "typeorm-transactional";
import type { Request } from "express";
import { OutboxRepository } from "src/module/sale-module/infrastructure/repository/outbox.repository";
import { OrderStatusEnum } from "src/module/sale-module/domain/order/order.enum";

@Injectable()
export class CreateOrderService {
    private readonly SALE_EXCHANGE = 'sale.exchange';

    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly outboxRepository: OutboxRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema',
    })
    async handle(req: Request, body: CreateOrderDto) {
        const { items } = body;
        const { user } = req;

        const order = await this.orderRepository.createOrder(
            {
                customer_uuid: user.uuid,
                total_price: body.total_price,
            }
        );
        const orderItems = await Promise.all(
            items.map(item =>
                this.orderItemRepository.createOrderItem({
                    order_uuid: order.uuid,
                    product_uuid: item.product_uuid,
                    quantity: item.quantity
                })
            )
        );
        order.items = orderItems;

        await this.orderRepository.updateOrderStatus(order.uuid, OrderStatusEnum.PLACED);

        // create outbox entry (fanout - no routing key)
        await this.outboxRepository.createOutboxEntry({
            exchange_name: this.SALE_EXCHANGE,
            routing_key: null,
            event_name: 'order.placed',
            message_payload: {
                order_uuid: order.uuid,
                customer_uuid: order.customer_uuid,
            },
        });

        return {
            data: order
        };
    }
}