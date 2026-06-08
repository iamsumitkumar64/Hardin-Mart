import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { GetOrderListingModule } from "./get-orders/get-orders.module";
import { CreateOrderModule } from "./create-order/create-order.module";
import { GetMaterializedViewOrderListingModule } from "./get-materialized-view-listing/get-order-listing.module";

@Module({
    imports: [
        GetOrderListingModule,
        CreateOrderModule,
        GetMaterializedViewOrderListingModule,
        RouterModule.register([
            {
                path: 'shipment/order',
                children: [
                    { path: '', module: GetOrderListingModule },
                    { path: '', module: CreateOrderModule },
                    { path: '', module: GetMaterializedViewOrderListingModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class OrderModule { }