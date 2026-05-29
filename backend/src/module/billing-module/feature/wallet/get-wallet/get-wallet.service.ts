import { BadRequestException, Injectable } from "@nestjs/common";
import { BillingRepository } from "src/module/billing-module/infrastructure/repository/billing.repository";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";

@Injectable()
export class GetWalletService {
    constructor(
        private readonly repository: BillingRepository,
    ) { }

    async getWallet(user: UserEntity) {
        let wallet = await this.repository.findWallet(user.uuid);
        if (!wallet) {
            wallet = await this.repository.createWallet({ user_uuid: user.uuid, balance: 0 });
        }

        return {
            data: wallet,
            message: "Wallet fetched successfully"
        };
    }
}