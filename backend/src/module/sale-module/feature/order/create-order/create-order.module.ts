import { Module } from "@nestjs/common";
import { CreateOrderController } from "./create-order.controller";
import { CreateOrderService } from "./create-order.handler";
import { OrderRepository } from "src/module/sale-module/infrastructure/repository/order.repository";
import { OrderItemRepository } from "src/module/sale-module/infrastructure/repository/order.item.repository";

@Module({
    imports: [],
    controllers: [CreateOrderController],
    providers: [CreateOrderService, OrderRepository, OrderItemRepository],
    exports: [],
})
export class CreateOrderModule { }
