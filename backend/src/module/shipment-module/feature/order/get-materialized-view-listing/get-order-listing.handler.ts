import { Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";

@Injectable()
export class GetMaterializedViewOrderListingService {
    constructor(
        private readonly repository: OrderRepository,
    ) { }

    async handle(offset?: number, limit?: number) {
        const result = await this.repository.getOrderListingFromMaterializedView(offset, limit);

        return { ...result };
    }
}