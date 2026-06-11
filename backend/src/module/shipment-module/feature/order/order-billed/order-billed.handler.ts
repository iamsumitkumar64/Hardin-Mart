import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";
import { OrderStatusEnum } from "src/module/sale-module/domain/order/order.enum";
import { ProductRepository } from "src/module/shipment-module/infrastructure/repository/product.repository";
import { OutboxRepository } from "src/module/shipment-module/infrastructure/repository/outbox.repository";
import { runOnTransactionCommit, Transactional } from "typeorm-transactional";
import type { OrderBilledMQEventPayload } from "src/module/shipment-module/infrastructure/rabbit-mq/rabbit-mq.type";
import { ShippingPolicyService } from "src/module/shipment-module/infrastructure/policy/shipping/shipping.policy.service";
import { OrderPublishEventEnum } from "src/module/shipment-module/domain/order/order.event";

@Injectable()
export class OrderBilledService {
    private readonly SHIPPING_EXCHANGE = 'shipping.exchange';

    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly productRepository: ProductRepository,
        private readonly outboxRepository: OutboxRepository,
        private readonly shippingPolicyService: ShippingPolicyService,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
    })
    async handle(order: OrderBilledMQEventPayload) {
        const orderData = await this.orderRepository.findByUserUuidAndOrderUuid(order.customer_uuid, order.order_uuid);
        if (!orderData) {
            throw new BadRequestException("Order not found");
        }

        const hasEnoughStock = await this.checkStock(orderData.items || []);
        hasEnoughStock ? OrderStatusEnum.READY_TO_SHIP : OrderStatusEnum.CANCELLED;

        await this.orderRepository.updateOrder(order.order_uuid, { is_billed: true });

        if (hasEnoughStock) {
            for (const item of orderData.items) {
                await this.productRepository.decreaseStock(
                    item.product_uuid,
                    item.quantity,
                );
            }
        } else {
            await this.outboxRepository.createOutboxEntry({
                exchange_name: this.SHIPPING_EXCHANGE,
                event_name: OrderPublishEventEnum.BACK_ORDER,
                message_payload: {
                    order_uuid: order.order_uuid,
                    customer_uuid: order.customer_uuid,
                },
            });
            return;
        }

        await this.shippingPolicyService.handleSetPolicy(order.order_uuid, { is_billed: true, is_placed: orderData.is_placed, data: order });

        return;
    }

    private async checkStock(items: { product_uuid: string; quantity: number; }[]) {
        for (const item of items) {
            const product = await this.productRepository.findByUuid(item.product_uuid);
            if (!product || item.quantity > product.stock) {
                return false;
            }
        }
        return true;
    }
}