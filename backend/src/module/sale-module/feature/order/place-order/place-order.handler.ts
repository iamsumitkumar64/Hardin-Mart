import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderRepository } from "src/module/sale-module/infrastructure/repository/order.repository";

@Injectable()
export class PlaceOrderService {
    constructor(
        private readonly orderRepository: OrderRepository
    ) { }

    async handle(order_uuid: string) {
        const order = await this.orderRepository.findByUuid(order_uuid);
        if (!order) {
            throw new NotFoundException(`Order ${order_uuid} not found`);
        }

        return {
            order_id: order.id,
            order_uuid: order.uuid,
            total_price: order.total_price,
        };
    }
}
