import { Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import { OrderPaymentStatusEnum } from "src/module/billing-module/domain/order/order.enum";
import { WalletHistoryTypeEnum } from "src/module/billing-module/domain/wallet-history/wallet.enum";
import type { OrderRefundMQEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { SocketService } from "src/module/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/module/common/infrastruture/socket/socket.enum";
import { runOnTransactionCommit, Transactional } from "typeorm-transactional";
import { WalletRepository } from "src/module/billing-module/infrastructure/repository/wallet.repository";
import { WalletHistoryRepository } from "src/module/billing-module/infrastructure/repository/wallet.history.repository";

@Injectable()
export class OrderRefundService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly walletRepository: WalletRepository,
        private readonly walletHistoryRepository: WalletHistoryRepository,
        private readonly socketService: SocketService,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema',
    })
    async handle(order: OrderRefundMQEventPayload) {
        const orderData = await this.orderRepository.findByUserUuidAndOrderUuid(order.user_uuid, order.order_uuid);
        if (!orderData || orderData.payment_status === OrderPaymentStatusEnum.REFUND) {
            return;
        }

        let wallet = await this.walletRepository.findWallet(order.user_uuid);
        if (!wallet) {
            wallet = await this.walletRepository.createWallet({
                user_uuid: order.user_uuid,
                balance: 0
            });
        }

        wallet.balance += Number(orderData.total_price);
        await this.walletRepository.saveWallet(wallet);

        await this.orderRepository.updateOrderPaymentStatus(order.order_uuid, OrderPaymentStatusEnum.REFUND);
        await this.walletHistoryRepository.createHistory({
            user_uuid: order.user_uuid,
            order_uuid: order.order_uuid,
            amount: Number(orderData.total_price),
            type: WalletHistoryTypeEnum.REFUND,
            description: order.reason || `Refund for order '${order.order_uuid}'`,
        });

        runOnTransactionCommit(async () => {
            await this.socketService.emitToUser(
                order.user_uuid,
                SocketEventNameEnum.ORDER__PAYMENT_STATUS_CHANGED,
                {
                    order_uuid: order.order_uuid,
                    payment_status: OrderPaymentStatusEnum.REFUND
                }
            );
        });

        return;
    }
}