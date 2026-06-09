import { BadRequestException, Injectable } from "@nestjs/common";
import type { OrderRefundMQEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { OrderStatusEnum } from "src/module/sale-module/domain/order/order.enum";
import { runOnTransactionCommit, Transactional } from "typeorm-transactional";
import { OrderRepository } from "src/module/sale-module/infrastructure/repository/order.repository";

@Injectable()
export class OrderRefundService {
    constructor(
        private readonly orderRepository: OrderRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema',
    })
    async handle(order: OrderRefundMQEventPayload) {
        const orderData = await this.orderRepository.findByUserUuidAndOrderUuid(order.customer_uuid, order.order_uuid);
        if (!orderData) {
            throw new BadRequestException("Order not found");
        }

        await this.orderRepository.updateOrderStatus(order.order_uuid, OrderStatusEnum.CANCELLED);

        return;
    }
}