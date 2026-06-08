import { Module } from "@nestjs/common";
import { CreateOrderController } from "./create-order.controller";
import { CreateOrderService } from "./create-order.handler";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import { OutboxRepository } from "src/module/billing-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [],
    controllers: [CreateOrderController],
    providers: [CreateOrderService, OrderRepository, OutboxRepository],
    exports: [],
})
export class CreateOrderModule { }
