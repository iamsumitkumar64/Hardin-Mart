import { Injectable } from "@nestjs/common";
import { BillingRepository } from "src/module/billing-module/infrastructure/repository/billing.repository";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import { OrderPaymentStatusEnum } from "src/module/billing-module/domain/order/order.enum";
import { WalletHistoryTypeEnum } from "src/module/billing-module/domain/wallet-history/wallet.enum";
import { OrderRefundMQEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { SocketService } from "src/module/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/module/common/infrastruture/socket/socket.enum";

@Injectable()
export class OrderRefundService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly billingRepository: BillingRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(order: OrderRefundMQEventPayload) {
        const orderData = await this.orderRepository.findByUserUuidAndOrderUuid(order.user_uuid, order.order_uuid);
        if (!orderData || orderData.payment_status === OrderPaymentStatusEnum.REFUND) {
            return;
        }

        let wallet = await this.billingRepository.findWallet(order.user_uuid);
        if (!wallet) {
            wallet = await this.billingRepository.createWallet({
                user_uuid: order.user_uuid,
                balance: 0
            });
        }

        wallet.balance += Number(orderData.total_price);
        await this.billingRepository.saveWallet(wallet);

        await this.orderRepository.updateOrderPaymentStatus(order.order_uuid, OrderPaymentStatusEnum.REFUND);
        await this.billingRepository.createHistory({
            user_uuid: order.user_uuid,
            order_uuid: order.order_uuid,
            amount: Number(orderData.total_price),
            type: WalletHistoryTypeEnum.REFUND,
            description: order.reason || `Refund for order '${order.order_uuid}'`,
        });

        await this.socketService.emitToUser(
            order.user_uuid,
            SocketEventNameEnum.ORDER__PAYMENT_STATUS_CHANGED,
            {
                order_uuid: order.order_uuid,
                payment_status: OrderPaymentStatusEnum.REFUND
            }
        );

        return;
    }
}
