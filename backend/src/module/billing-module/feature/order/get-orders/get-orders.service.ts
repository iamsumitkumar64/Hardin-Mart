import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/billing-module/domain/user/user.entity";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";

@Injectable()
export class GetOrderListingService {
    constructor(
        private readonly repository: OrderRepository,
    ) { }

    async getOrderListing(user: UserEntity, offset?: number, limit?: number) {
        const { data, total } = await this.repository.getOrderListing(user, offset, limit);

        return {
            data: data,
            totalDocuments: total,
        }
    }
}