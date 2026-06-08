import { BadRequestException, Injectable } from "@nestjs/common";
import { runOnTransactionCommit, Transactional } from "typeorm-transactional";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";
import { PayOrderDto } from "./pay-order.dto";
import { WalletRepository } from "src/module/billing-module/infrastructure/repository/wallet.repository";
import { WalletHistoryRepository } from "src/module/billing-module/infrastructure/repository/wallet.history.repository";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import { OutboxRepository } from "src/module/billing-module/infrastructure/repository/outbox.repository";
import { OrderPaymentStatusEnum } from "src/module/billing-module/domain/order/order.enum";
import { WalletHistoryTypeEnum } from "src/module/billing-module/domain/wallet-history/wallet.enum";
import { ExchangeNameEnum, RoutingKeyEnum, } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { SocketService } from "src/module/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/module/common/infrastruture/socket/socket.enum";
import { OrderStatusEnum } from "src/module/shipment-module/domain/order/order.enum";

@Injectable()
export class PayOrderService {
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly walletHistoryRepository: WalletHistoryRepository,
        private readonly orderRepository: OrderRepository,
        private readonly outboxRepository: OutboxRepository,
        private readonly socketService: SocketService,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_BILLING_SCHEMA || "billing_schema",
    })
    async handle(user_uuid: string, body: PayOrderDto,) {
        const { order_uuid } = body;

        try {
            // fetch/create wallet
            const wallet = await this.walletRepository.upsertWallet(user_uuid);
            // if (!wallet) {
            //     wallet = await this.walletRepository.createWallet({ user_uuid: user_uuid, balance: 0 });
            // }

            // check order
            const order = await this.orderRepository.findByUserUuidAndOrderUuid(user_uuid, order_uuid,);
            if (!order) {
                throw new BadRequestException("Order not found",);
            }

            if (order.payment_status === OrderPaymentStatusEnum.PAID || order.payment_status === OrderPaymentStatusEnum.REFUND) {
                throw new BadRequestException("Order payment can't able to process now",);
            }

            if (wallet.balance < order.total_price) {
                await this.orderRepository.updateOrderPaymentStatus(
                    order_uuid,
                    OrderPaymentStatusEnum.FAILED,
                );

                throw new BadRequestException("Balance is low . Please do add amount");
            }

            // deduct wallet balance
            wallet.balance -= order.total_price;
            await this.walletRepository.saveWallet(wallet);

            // update payment status
            await this.orderRepository.updateOrderPaymentStatus(
                order_uuid,
                OrderPaymentStatusEnum.PAID,
            );

            // create history
            await this.walletHistoryRepository.createHistory({
                user_uuid: user_uuid,
                order_uuid,
                amount: order.total_price,
                type: WalletHistoryTypeEnum.DEBIT,
                description: `Paid for order '${order.uuid}'`,
            });

            // create outbox entry
            await this.outboxRepository.createOutboxEntry({
                exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
                routing_key: RoutingKeyEnum.ORDER_BLLIED,
                message_payload: {
                    order_uuid,
                    user_uuid: user_uuid,
                },
            });

            runOnTransactionCommit(async () => {
                await this.socketService.emitToUser(
                    user_uuid,
                    SocketEventNameEnum.ORDER__PAYMENT_STATUS_CHANGED,
                    {
                        order_uuid,
                        payment_status: OrderPaymentStatusEnum.PAID,
                    },
                );

                await this.socketService.emitToUser(
                    user_uuid,
                    SocketEventNameEnum.ORDER_STATUS_CHANGED,
                    {
                        order_uuid,
                        order_status: OrderStatusEnum.BILLED,
                    },
                );
            });

            return;
        } catch (error) {
            await this.orderRepository.updateOrderPaymentStatus(
                order_uuid,
                OrderPaymentStatusEnum.FAILED,
            );

            await this.socketService.emitToUser(
                user_uuid,
                SocketEventNameEnum.ORDER__PAYMENT_STATUS_CHANGED,
                {
                    order_uuid,
                    payment_status: OrderPaymentStatusEnum.FAILED,
                },
            );

            throw error;
        }
    }
}