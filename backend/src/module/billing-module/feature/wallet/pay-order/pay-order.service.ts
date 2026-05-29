import { BadRequestException, Injectable, Req } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BillingRepository } from "src/module/billing-module/infrastructure/repository/billing.repository";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";
import { PayOrderDto } from "./pay-order.dto";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import { OrderPaymentStatusEnum } from "src/module/billing-module/domain/order/order.enum";
import { WalletHistoryTypeEnum } from "src/module/billing-module/domain/wallet-history/wallet.enum";
import { OutboxRepository } from "src/module/billing-module/infrastructure/repository/outbox.repository";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { SocketService } from "src/module/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/module/common/infrastruture/socket/socket.enum";
import { WalletEntity } from "src/module/billing-module/domain/wallet/wallet.entity";

@Injectable()
export class PayOrderService {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema')
        private readonly dataSource: DataSource,
        private readonly billingRepository: BillingRepository,
        private readonly orderRepository: OrderRepository,
        private readonly outboxRepository: OutboxRepository,
        private readonly socketService: SocketService,
    ) { }

    async payOrder(user: UserEntity, body: PayOrderDto) {
        const { order_uuid } = body;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // fetch create wallet
            let wallet = await queryRunner.manager.findOne(WalletEntity, {
                where: { user_uuid: user.uuid }
            });
            if (!wallet) {
                wallet = queryRunner.manager.create(WalletEntity, {
                    user_uuid: user.uuid,
                    balance: 0
                });
                wallet = await queryRunner.manager.save(wallet);
            }

            // check is order exists
            const order = await this.orderRepository.findByUserUuidAndOrderUuid(user.uuid, order_uuid);
            if (!order) {
                throw new BadRequestException("Order not found");
            }
            if (order.payment_status !== OrderPaymentStatusEnum.PENDING) {
                throw new BadRequestException("Order payment can't able to process now");
            }
            if (wallet.balance < order.total_price) {
                await this.orderRepository.updateOrderPaymentStatus(
                    order_uuid,
                    OrderPaymentStatusEnum.FAILED
                );
                throw new BadRequestException("Balance is low . Please do add amount");
            }

            // deduct balance from wallet
            wallet.balance -= order.total_price;
            await queryRunner.manager.save(wallet);

            // make status change and history entry
            await this.orderRepository.updateOrderPaymentStatus(order_uuid, OrderPaymentStatusEnum.PAID);
            await this.billingRepository.createHistory({
                user_uuid: user.uuid,
                order_uuid: body.order_uuid,
                amount: order.total_price,
                type: WalletHistoryTypeEnum.DEBIT,
                description: `Paid for order '${order.uuid}`,
            });

            // make outbox entry for order paid
            await this.outboxRepository.createOutboxntry({
                exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
                routing_key: RoutingKeyEnum.ORDER_PAID,
                message_payload: {
                    order_uuid,
                    user_uuid: user.uuid
                },
            });

            await queryRunner.commitTransaction();

            await this.socketService.emitToUser(
                user.uuid,
                SocketEventNameEnum.ORDER__PAYMENT_STATUS_CHANGED,
                {
                    order_uuid,
                    payment_status: OrderPaymentStatusEnum.PAID
                }
            );
            return;
        } catch (error) {
            await queryRunner.rollbackTransaction();

            await this.orderRepository.updateOrderPaymentStatus(order_uuid, OrderPaymentStatusEnum.FAILED);

            await this.socketService.emitToUser(
                user.uuid,
                SocketEventNameEnum.ORDER__PAYMENT_STATUS_CHANGED,
                {
                    order_uuid,
                    payment_status: OrderPaymentStatusEnum.FAILED
                }
            );
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}