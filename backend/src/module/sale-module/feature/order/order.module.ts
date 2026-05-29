import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreateOrderModule } from "./create-order/create-order.module";
import { GetOrderListingModule } from "./get-orders/get-orders.module";

@Module({
    imports: [
        CreateOrderModule,
        GetOrderListingModule,
        RouterModule.register([
            {
                path: 'sale/order',
                children: [
                    { path: '', module: CreateOrderModule },
                    { path: '', module: GetOrderListingModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class OrderModule { }