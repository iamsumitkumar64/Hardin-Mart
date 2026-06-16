import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/shipment-module/domain/user/user.entity";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";

@Injectable()
export class GetMaterializedViewOrderListingService {
    constructor(
        private readonly repository: OrderRepository,
    ) { }

    async handle(user: UserEntity, offset?: number, limit?: number) {
        const result = await this.repository.getOrderListingFromMaterializedView(user, offset, limit);

        return { ...result };
    }
}