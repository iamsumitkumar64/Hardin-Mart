import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { GetProductListingModule } from "./get-product-listing/get-product-listing.module";
import { GetMaterializedViewProductListingModule } from "./get-materialized-view-listing/get-product-listing.module";

@Module({
    imports: [
        GetProductListingModule,
        GetMaterializedViewProductListingModule,
        RouterModule.register([
            {
                path: 'shipment/product',
                children: [
                    { path: '/', module: GetProductListingModule },
                    { path: '/', module: GetMaterializedViewProductListingModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})

export class ProductModule { }