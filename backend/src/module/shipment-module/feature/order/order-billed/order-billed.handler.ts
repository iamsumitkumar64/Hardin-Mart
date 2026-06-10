import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";
import type { OrderBilledMQEventPayload } from "src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { OrderStatusEnum } from "src/module/sale-module/domain/order/order.enum";
import { ProductRepository } from "src/module/shipment-module/infrastructure/repository/product.repository";
import { OutboxRepository } from "src/module/shipment-module/infrastructure/repository/outbox.repository";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { runOnTransactionCommit, Transactional } from "typeorm-transactional";

@Injectable()
export class OrderBilledService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly productRepository: ProductRepository,
        private readonly outboxRepository: OutboxRepository,
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
                exchange_name: ExchangeNameEnum.SHIPPING_EXCHANGE,
                routing_key: RoutingKeyEnum.BACK_ORDERED,
                event_name: RoutingKeyEnum.BACK_ORDERED,
                message_payload: {
                    order_uuid: order.order_uuid,
                    customer_uuid: order.customer_uuid,
                },
            });
            return;
        }

        await this.outboxRepository.createOutboxEntry({
            exchange_name: ExchangeNameEnum.SHIPPING_EXCHANGE,
            routing_key: RoutingKeyEnum.SHIPPING_LABEL_CREATED,
            event_name: RoutingKeyEnum.SHIPPING_LABEL_CREATED,
            message_payload: {
                order_uuid: order.order_uuid,
                customer_uuid: order.customer_uuid,
            },
        });

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