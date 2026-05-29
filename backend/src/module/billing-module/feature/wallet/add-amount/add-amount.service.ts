import { BadRequestException, Injectable, Req } from "@nestjs/common";
import { BillingRepository } from "src/module/billing-module/infrastructure/repository/billing.repository";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";
import { AddAmountWalletDto } from "./add-amount.dto";
import { WalletHistoryTypeEnum } from "src/module/billing-module/domain/wallet-history/wallet.enum";

@Injectable()
export class AddAmountService {
    constructor(
        private readonly repository: BillingRepository,
    ) { }

    async addAmount(user: UserEntity, body: AddAmountWalletDto) {
        const { amount } = body;

        if (!amount || amount <= 0) {
            throw new BadRequestException("Amount must be greater than zero");
        }

        let wallet = await this.repository.findWallet(user.uuid);
        if (!wallet) {
            wallet = await this.repository.createWallet({ user_uuid: user.uuid, balance: 0 });
        }

        wallet.balance += amount;
        await this.repository.saveWallet(wallet);
        await this.repository.createHistory({
            user_uuid: user.uuid,
            amount,
            type: WalletHistoryTypeEnum.TOPUP,
            description: 'Wallet top-up',
        });

        return;
    }
}