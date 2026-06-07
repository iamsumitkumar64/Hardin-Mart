import { Module } from "@nestjs/common";
import { CreateOrderController } from "./create-order.controller";
import { CreateOrderService } from "./create-order.handler";
import { OrderRepository } from "src/module/sale-module/infrastructure/repository/order.repository";
import { OrderItemRepository } from "src/module/sale-module/infrastructure/repository/order.item.repository";
import { OutboxRepository } from "src/module/sale-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [],
    controllers: [CreateOrderController],
    providers: [CreateOrderService, OrderRepository, OrderItemRepository, OutboxRepository],
    exports: [],
})
export class CreateOrderModule { }
