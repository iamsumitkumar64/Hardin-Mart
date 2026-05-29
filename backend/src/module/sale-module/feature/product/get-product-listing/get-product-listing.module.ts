import { Module } from "@nestjs/common";
import { GetProductListingController } from "./get-product-listing.controller";
import { GetProductListingService } from "./get-product-listing.handler";
import { ProductRepository } from "src/module/sale-module/infrastructure/repository/product.repository";

@Module({
    imports: [],
    controllers: [GetProductListingController],
    providers: [GetProductListingService, ProductRepository],
    exports: [],
})

export class GetProductListingModule { }