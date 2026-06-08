import { Module } from "@nestjs/common";
import { GetMaterializedViewOrderListingController } from "./get-order-listing.controller";
import { GetMaterializedViewOrderListingService } from "./get-order-listing.handler";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";

@Module({
    imports: [],
    controllers: [GetMaterializedViewOrderListingController],
    providers: [GetMaterializedViewOrderListingService, OrderRepository],
    exports: [],
})

export class GetMaterializedViewOrderListingModule { }