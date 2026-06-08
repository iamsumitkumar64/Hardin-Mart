import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { PlaceOrderController } from "./place-order.controller";
import { PlaceOrderService } from "./place-order.handler";
import { OrderRepository } from "src/module/sale-module/infrastructure/repository/order.repository";

@Module({
    imports: [
        RouterModule.register([
            {
                path: 'sales/orders',
                module: PlaceOrderModule,
            },
        ]),
    ],
    controllers: [PlaceOrderController],
    providers: [PlaceOrderService, OrderRepository,]
})
export class PlaceOrderModule { }
