import { Module } from "@nestjs/common";
import { CreateOrderController } from "./create-order.controller";
import { CreateOrderService } from "./create-order.handler";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";

@Module({
    imports: [],
    controllers: [CreateOrderController],
    providers: [CreateOrderService, OrderRepository],
    exports: [],
})
export class CreateOrderModule { }
