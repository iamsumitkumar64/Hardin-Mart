import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { GetOrderListingModule } from "./get-orders/get-orders.module";
import { CreateOrderModule } from "./create-order/create-order.module";

@Module({
    imports: [
        GetOrderListingModule,
        CreateOrderModule,
        RouterModule.register([
            {
                path: 'billing/order',
                children: [
                    { path: '', module: GetOrderListingModule },
                    { path: '', module: CreateOrderModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class OrderModule { }