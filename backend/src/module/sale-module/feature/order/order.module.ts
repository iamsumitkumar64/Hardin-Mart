import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreateOrderModule } from "./create-order/create-order.module";
import { GetOrderListingModule } from "./get-orders/get-orders.module";
import { PlaceOrderModule } from "./place-order/place-order.module";

@Module({
    imports: [
        CreateOrderModule,
        GetOrderListingModule,
        PlaceOrderModule,
        RouterModule.register([
            {
                path: 'sale/order',
                children: [
                    { path: '', module: CreateOrderModule },
                    { path: '', module: GetOrderListingModule },
                    { path: '', module: PlaceOrderModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class OrderModule { }