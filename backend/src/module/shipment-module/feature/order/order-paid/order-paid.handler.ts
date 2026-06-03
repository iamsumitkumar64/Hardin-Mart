import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";
import type { OrderPaidMQEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { OrderStatusEnum } from "src/module/shipment-module/domain/order/order.enum";
import { SocketService } from "src/module/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/module/common/infrastruture/socket/socket.enum";
import { ProductRepository } from "src/module/shipment-module/infrastructure/repository/product.repository";
import { OutboxRepository } from "src/module/shipment-module/infrastructure/repository/outbox.repository";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { runOnTransactionCommit, Transactional } from "typeorm-transactional";

@Injectable()
export class OrderPaidService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly productRepository: ProductRepository,
        private readonly outboxRepository: OutboxRepository,
        private readonly socketService: SocketService,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
    })
    async handle(order: OrderPaidMQEventPayload) {
        const orderData = await this.orderRepository.findByUserUuidAndOrderUuid(order.user_uuid, order.order_uuid);
        if (!orderData) {
            throw new BadRequestException("Order not found");
        }

        const hasEnoughStock = await this.checkStock(orderData.items || []);
        const orderStatus = hasEnoughStock ? OrderStatusEnum.READY_TO_SHIP : OrderStatusEnum.CANCELLED;

        await this.orderRepository.updateOrderStatus(order.order_uuid, orderStatus);

        if (hasEnoughStock) {
            for (const item of orderData.items) {
                await this.productRepository.decreaseStock(
                    item.product_uuid,
                    item.quantity,
                );
            }
        } else {
            await this.outboxRepository.createOutboxEntry({
                exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
                routing_key: RoutingKeyEnum.ORDER_REFUND,
                message_payload: {
                    order_uuid: order.order_uuid,
                    user_uuid: order.user_uuid,
                    reason: "Stock not available",
                },
            });
        }

        runOnTransactionCommit(async () => {
            await this.socketService.emitToUser(
                order.user_uuid,
                SocketEventNameEnum.ORDER_STATUS_CHANGED,
                {
                    order_uuid: order.order_uuid,
                    order_status: orderStatus,
                },
            );

            if (hasEnoughStock) {
                for (const item of orderData.items) {
                    await this.socketService.emitToUser(
                        order.user_uuid,
                        SocketEventNameEnum.PRODUCT_STOCK_DECREASE_BY_QUANTITY,
                        {
                            product_uuid: item.product_uuid,
                            quantity: item.quantity,
                        },
                    );
                }
            }
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