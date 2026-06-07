import { Injectable } from "@nestjs/common";
import { ProductRepository } from "src/module/shipment-module/infrastructure/repository/product.repository";

@Injectable()
export class GetMaterializedViewProductListingService {
    constructor(
        private readonly repository: ProductRepository,
    ) { }

    async handle(offset?: number, limit?: number) {
        const result = await this.repository.getProductListingFromMaterializedView(offset, limit);

        return { ...result };
    }
}