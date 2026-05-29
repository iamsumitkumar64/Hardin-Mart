import { BadRequestException, Injectable } from "@nestjs/common";
import { BillingRepository } from "src/module/billing-module/infrastructure/repository/billing.repository";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";

@Injectable()
export class GetWalletHistoryService {
    constructor(
        private readonly repository: BillingRepository,
    ) { }

    async getWalletHistory(user: UserEntity) {
        const history = await this.repository.findHistories(user.uuid);

        return {
            data: history,
        };
    }
}