import { Module } from "@nestjs/common";
import { PayOrderController } from "./pay-order.controller";
import { PayOrderService } from "./pay-order.handler";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import { OutboxRepository } from "src/module/billing-module/infrastructure/repository/outbox.repository";
import { WalletRepository } from "src/module/billing-module/infrastructure/repository/wallet.repository";
import { WalletHistoryRepository } from "src/module/billing-module/infrastructure/repository/wallet.history.repository";

@Module({
    imports: [],
    controllers: [PayOrderController],
    providers: [PayOrderService, WalletRepository, WalletHistoryRepository, OrderRepository, OutboxRepository],
    exports: [],
})
export class PayOrderModule { }
