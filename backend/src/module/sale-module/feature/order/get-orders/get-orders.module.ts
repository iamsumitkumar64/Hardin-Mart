import { Module } from "@nestjs/common";
import { GetOrderListingController } from "./get-orders.controller";
import { GetOrderListingService } from "./get-orders.handler";
import { OrderRepository } from "src/module/sale-module/infrastructure/repository/order.repository";

@Module({
    imports: [],
    controllers: [GetOrderListingController],
    providers: [GetOrderListingService, OrderRepository],
    exports: [],
})

export class GetOrderListingModule { }