import { BadRequestException, Injectable } from "@nestjs/common";
import { WalletRepository } from "src/module/billing-module/infrastructure/repository/wallet.repository";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";

@Injectable()
export class GetWalletService {
    constructor(
        private readonly repository: WalletRepository,
    ) { }

    async handle(user: UserEntity) {
        const wallet = await this.repository.upsertWallet(user.uuid);
        // if (!wallet) {
        //     wallet = await this.repository.createWallet({ customer_uuid: user.uuid, balance: 0 });
        // }

        return {
            data: wallet,
            message: "Wallet fetched successfully"
        };
    }
}