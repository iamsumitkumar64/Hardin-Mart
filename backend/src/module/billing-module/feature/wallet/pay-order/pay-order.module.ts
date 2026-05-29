import { Module } from "@nestjs/common";
import { BillingRepository } from "src/module/billing-module/infrastructure/repository/billing.repository";
import { PayOrderController } from "./pay-order.controller";
import { PayOrderService } from "./pay-order.service";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import { OutboxRepository } from "src/module/billing-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [],
    controllers: [PayOrderController],
    providers: [PayOrderService, BillingRepository, OrderRepository, OutboxRepository],
    exports: [],
})
export class PayOrderModule { }
