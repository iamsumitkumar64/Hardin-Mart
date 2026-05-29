import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { GetOrderListingModule } from "./get-orders/get-orders.module";

@Module({
    imports: [
        GetOrderListingModule,
        RouterModule.register([
            {
                path: 'billing/order',
                children: [
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