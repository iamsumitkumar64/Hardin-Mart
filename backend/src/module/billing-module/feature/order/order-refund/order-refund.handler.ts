import { Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import { OrderPaymentStatusEnum } from "src/module/billing-module/domain/order/order.enum";
import { WalletHistoryTypeEnum } from "src/module/billing-module/domain/wallet-history/wallet.enum";
import type { OrderRefundMQEventPayload } from "src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { runOnTransactionCommit, Transactional } from "typeorm-transactional";
import { WalletRepository } from "src/module/billing-module/infrastructure/repository/wallet.repository";
import { WalletHistoryRepository } from "src/module/billing-module/infrastructure/repository/wallet.history.repository";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OutboxRepository } from "src/module/billing-module/infrastructure/repository/outbox.repository";

@Injectable()
export class OrderRefundService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly walletRepository: WalletRepository,
        private readonly walletHistoryRepository: WalletHistoryRepository,
        private readonly outboxRepository: OutboxRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema',
    })
    async handle(order: OrderRefundMQEventPayload) {
        const orderData = await this.orderRepository.findByUserUuidAndOrderUuid(order.customer_uuid, order.order_uuid);
        if (!orderData || orderData.payment_status === OrderPaymentStatusEnum.REFUND) {
            return;
        }

        let wallet = await this.walletRepository.findWallet(order.customer_uuid);
        if (!wallet) {
            wallet = await this.walletRepository.createWallet({
                customer_uuid: order.customer_uuid,
                balance: 0
            });
        }

        wallet.balance += Number(orderData.total_price);
        await this.walletRepository.saveWallet(wallet);

        await this.orderRepository.updateOrderPaymentStatus(order.order_uuid, OrderPaymentStatusEnum.REFUND);
        await this.walletHistoryRepository.createHistory({
            customer_uuid: order.customer_uuid,
            order_uuid: order.order_uuid,
            amount: Number(orderData.total_price),
            type: WalletHistoryTypeEnum.REFUND,
            description: order.reason || `Refund for order '${order.order_uuid}'`,
        });

        await this.outboxRepository.createOutboxEntry({
            exchange_name: ExchangeNameEnum.BILLING_EXCHANGE,
            routing_key: RoutingKeyEnum.ORDER_REFUND,
            event_name: RoutingKeyEnum.ORDER_REFUND,
            message_payload: {
                order_uuid: order.order_uuid,
                customer_uuid: order.customer_uuid,
                reason: "Stock not available",
            },
        });

        return;
    }
}