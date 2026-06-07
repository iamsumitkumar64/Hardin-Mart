import { BadRequestException, Injectable } from "@nestjs/common";
import { ProductRepository } from "src/module/catalog-module/infrastructure/repository/product.repository";

@Injectable()
export class GetProductListingService {
    constructor(
        private readonly repository: ProductRepository,
    ) { }

    async handle(offset?: number, limit?: number) {
        const result = await this.repository.getProductListing(offset, limit);

        return { ...result };
    }
}