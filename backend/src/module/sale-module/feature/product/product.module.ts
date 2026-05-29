import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { GetProductListingModule } from "./get-product-listing/get-product-listing.module";

@Module({
    imports: [
        GetProductListingModule,
        RouterModule.register([
            {
                path: 'sale/product',
                children: [
                    { path: '/', module: GetProductListingModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})

export class ProductModule { }