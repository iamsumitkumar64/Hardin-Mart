import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";
import { CreateOrderDto } from "./create-order.dto";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OrderRepository } from "src/module/sale-module/infrastructure/repository/order.repository";
import { OrderItemRepository } from "src/module/sale-module/infrastructure/repository/order.item.repository";
import { OutboxRepository } from "src/module/sale-module/infrastructure/repository/outbox.repository";
import { Transactional } from "typeorm-transactional";
import { ApiCallService } from "src/module/common/infrastruture/services/api.call.service";
import type { Request } from "express";

@Injectable()
export class CreateOrderService {
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
        const { user, token } = req;

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
        const newOrder = {
            order_id: order.id,
            order_uuid: order.uuid,
            user_uuid: user.uuid,
            total_price: body.total_price,
            address_uuid: body.address_uuid,
            items: items.map((item, index) => ({
                uuid: orderItems[index].uuid,
                id: orderItems[index].id,
                product_uuid: item.product_uuid,
                quantity: item.quantity,
                created_at: orderItems[index].created_at,
            })),
            created_at: order.created_at,
        }

        const API_URL = process.env.BACKEND_URL;
        const billingUrl = `${API_URL}/api/v1/billing/order`;
        const shipmentUrl = `${API_URL}/api/v1/shipment/order`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: token,
        };

        await ApiCallService(billingUrl, 'POST', headers, JSON.stringify(newOrder));
        await ApiCallService(shipmentUrl, 'POST', headers, JSON.stringify(newOrder));
        return {
            data: order
        };
    }
}