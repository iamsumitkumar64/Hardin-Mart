import { BadRequestException, Injectable } from "@nestjs/common";
import { WalletHistoryRepository } from "src/module/billing-module/infrastructure/repository/wallet.history.repository";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";

@Injectable()
export class GetWalletHistoryService {
    constructor(
        private readonly repository: WalletHistoryRepository,
    ) { }

    async handle(user: UserEntity) {
        const history = await this.repository.findHistories(user.uuid);

        return {
            data: history,
        };
    }
}