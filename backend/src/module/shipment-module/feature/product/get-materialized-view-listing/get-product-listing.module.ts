import { Module } from "@nestjs/common";
import { GetMaterializedViewProductListingController } from "./get-product-listing.controller";
import { GetMaterializedViewProductListingService } from "./get-product-listing.handler";
import { ProductRepository } from "src/module/shipment-module/infrastructure/repository/product.repository";

@Module({
    imports: [],
    controllers: [GetMaterializedViewProductListingController],
    providers: [GetMaterializedViewProductListingService, ProductRepository],
    exports: [],
})

export class GetMaterializedViewProductListingModule { }