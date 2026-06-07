import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/sale-module/domain/user/user.entity";
import { OrderRepository } from "src/module/sale-module/infrastructure/repository/order.repository";

@Injectable()
export class GetOrderListingService {
    constructor(
        private readonly repository: OrderRepository,
    ) { }

    async handle(user: UserEntity, offset?: number, limit?: number) {
        const { data, total } = await this.repository.getOrderListing(user, offset, limit);

        return {
            data: data,
            totalDocuments: total,
        }
    }
}