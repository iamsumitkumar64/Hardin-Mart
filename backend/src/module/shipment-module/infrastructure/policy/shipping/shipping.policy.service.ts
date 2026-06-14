import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderPlacedMQEventPayload, OrderBilledMQEventPayload } from "../../rabbit-mq/rabbit-mq.type";
import { OutboxRepository } from "../../repository/outbox.repository";
import { OrderPublishEventEnum } from "src/module/shipment-module/domain/order/order.event";
import { OrderRepository } from "../../repository/order.repository";
import { ProductRepository } from "../../repository/product.repository";
import { Transactional } from "typeorm-transactional";
import { OrderEntity } from "src/module/shipment-module/domain/order/order.entity";

@Injectable()
export class ShippingPolicyService {
    protected readonly SHIPPING_EXCHANGE = 'shipping.exchange';

    constructor(
        private readonly outboxRepository: OutboxRepository,
        private readonly orderRepository: OrderRepository,
        private readonly productRepository: ProductRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
    })
    async handleOrderPlaced(payload: OrderPlacedMQEventPayload) {
        const order = await this.orderRepository.findByUserUuidAndOrderUuid(payload.customer_uuid, payload.order_uuid);
        if (!order) return;

        order.is_placed = true;
        await this.orderRepository.save(order);
        await this.processOrder(order);
    }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
    })
    async handleOrderBilled(payload: OrderBilledMQEventPayload) {
        const order = await this.orderRepository.findByUserUuidAndOrderUuid(payload.customer_uuid, payload.order_uuid);
        if (!order) throw new BadRequestException("Order not found");

        const hasEnoughStock = await this.checkStock(order.items || []);
        if (!hasEnoughStock) {
            await this.outboxRepository.createOutboxEntry({
                exchange_name: this.SHIPPING_EXCHANGE,
                event_name: OrderPublishEventEnum.BACK_ORDER,
                message_payload: { order_uuid: order.uuid, customer_uuid: order.customer_uuid },
            });
            return;
        }

        for (const item of order.items) {
            await this.productRepository.decreaseStock(item.product_uuid, item.quantity);
        }

        order.is_billed = true;
        await this.orderRepository.save(order);
        await this.processOrder(order);
    }

    private async processOrder(order: OrderEntity) {
        if (order.is_billed && order.is_placed) {
            await this.outboxRepository.createOutboxEntry({
                exchange_name: this.SHIPPING_EXCHANGE,
                event_name: OrderPublishEventEnum.SHIPPING_LABEL_ORDERED,
                message_payload: {
                    order_uuid: order.uuid,
                    customer_uuid: order.customer_uuid,
                },
            });
        }
    }

    private async checkStock(items: { product_uuid: string; quantity: number; }[]) {
        for (const item of items) {
            const product = await this.productRepository.findByUuid(item.product_uuid);
            if (!product || item.quantity > product.stock) return false;
        }
        return true;
    }
}