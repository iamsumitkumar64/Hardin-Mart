import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./create-order.dto";
import { OrderRepository } from "src/module/sale-module/infrastructure/repository/order.repository";
import { OrderItemRepository } from "src/module/sale-module/infrastructure/repository/order.item.repository";
import { Transactional } from "typeorm-transactional";
import type { Request } from "express";

@Injectable()
export class CreateOrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderItemRepository: OrderItemRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema',
    })
    async handle(req: Request, body: CreateOrderDto) {
        const { items } = body;
        const { user } = req;

        const order = await this.orderRepository.createOrder(
            {
                user_uuid: user.uuid,
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

        return {
            data: order
        };
    }
}