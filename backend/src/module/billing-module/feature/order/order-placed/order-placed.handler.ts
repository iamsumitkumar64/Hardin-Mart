import { BadRequestException, Injectable } from "@nestjs/common";
import { runOnTransactionCommit, Transactional } from "typeorm-transactional";
import { OrderPlacedDto } from "./order-placed.dto";
import { WalletRepository } from "src/module/billing-module/infrastructure/repository/wallet.repository";
import { WalletHistoryRepository } from "src/module/billing-module/infrastructure/repository/wallet.history.repository";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import { OutboxRepository } from "src/module/billing-module/infrastructure/repository/outbox.repository";
import { OrderPaymentStatusEnum } from "src/module/billing-module/domain/order/order.enum";
import { WalletHistoryTypeEnum } from "src/module/billing-module/domain/wallet-history/wallet.enum";
import { OrderPublishEventEnum } from "src/module/billing-module/domain/order/order.event";

@Injectable()
export class OrderPlacedService {
    private readonly BILLING_EXCHANGE = 'billing.exchange';

    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly walletHistoryRepository: WalletHistoryRepository,
        private readonly orderRepository: OrderRepository,
        private readonly outboxRepository: OutboxRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_BILLING_SCHEMA || "billing_schema",
    })
    async handle(customer_uuid: string, body: OrderPlacedDto) {
        const { order_uuid } = body;

        try {
            // fetch/create wallet
            const wallet = await this.walletRepository.upsertWallet(customer_uuid);
            // if (!wallet) {
            //     wallet = await this.walletRepository.createWallet({ customer_uuid: customer_uuid, balance: 0 });
            // }

            // check order
            const order = await this.orderRepository.findByUserUuidAndOrderUuid(customer_uuid, order_uuid,);
            if (!order) {
                throw new BadRequestException("Order not found");
            }

            if (order.payment_status === OrderPaymentStatusEnum.PAID || order.payment_status === OrderPaymentStatusEnum.REFUND) {
                throw new BadRequestException("Order payment can't able to process now");
            }

            if (wallet.balance < order.total_price) {
                await this.orderRepository.updateOrderPaymentStatus(
                    order_uuid,
                    OrderPaymentStatusEnum.FAILED,
                );

                // throw new BadRequestException("Balance is low . Please do add amount");

                await this.outboxRepository.createOutboxEntry({
                    exchange_name: this.BILLING_EXCHANGE,
                    event_name: OrderPublishEventEnum.PAYMENT_FAILED,
                    message_payload: {
                        order_uuid,
                        customer_uuid: customer_uuid,
                    },
                });
                return;
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
                customer_uuid: customer_uuid,
                order_uuid,
                amount: order.total_price,
                type: WalletHistoryTypeEnum.DEBIT,
                description: `Paid for order '${order.uuid}'`,
            });

            await this.outboxRepository.createOutboxEntry({
                exchange_name: this.BILLING_EXCHANGE,
                event_name: OrderPublishEventEnum.ORDER_BILLED,
                message_payload: {
                    order_uuid,
                    customer_uuid: customer_uuid,
                },
            });

            return;
        } catch (error) {
            await this.orderRepository.updateOrderPaymentStatus(
                order_uuid,
                OrderPaymentStatusEnum.FAILED,
            );

            throw error;
        }
    }
}