import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { PlaceOrderController } from "./place-order.controller";
import { PlaceOrderService } from "./place-order.handler";
import { CreateOrderService } from "src/module/sale-module/feature/order/create-order/create-order.handler";
import { OrderRepository } from "src/module/sale-module/infrastructure/repository/order.repository";
import { OrderItemRepository } from "src/module/sale-module/infrastructure/repository/order.item.repository";
import { OutboxRepository } from "src/module/sale-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [
        RouterModule.register([
            {
                path: 'sale/order',
                module: PlaceOrderModule,
            },
        ]),
    ],
    controllers: [PlaceOrderController],
    providers: [PlaceOrderService, CreateOrderService, OrderRepository, OrderItemRepository, OutboxRepository],
})
export class PlaceOrderModule { }
