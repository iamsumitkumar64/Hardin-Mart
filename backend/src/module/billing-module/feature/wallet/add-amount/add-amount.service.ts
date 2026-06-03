import { BadRequestException, Injectable, Req } from "@nestjs/common";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";
import { AddAmountWalletDto } from "./add-amount.dto";
import { WalletHistoryTypeEnum } from "src/module/billing-module/domain/wallet-history/wallet.enum";
import { WalletRepository } from "src/module/billing-module/infrastructure/repository/wallet.repository";
import { WalletHistoryRepository } from "src/module/billing-module/infrastructure/repository/wallet.history.repository";

@Injectable()
export class AddAmountService {
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly walletHistoryRepository: WalletHistoryRepository,
    ) { }

    async addAmount(user: UserEntity, body: AddAmountWalletDto) {
        const { amount } = body;

        if (!amount || amount <= 0) {
            throw new BadRequestException("Amount must be greater than zero");
        }

        const wallet = await this.walletRepository.upsertWallet(user.uuid);
        // if (!wallet) {
        //     wallet = await this.walletRepository.createWallet({ user_uuid: user.uuid, balance: 0 });
        // }

        wallet.balance += amount;
        await this.walletRepository.saveWallet(wallet);
        await this.walletHistoryRepository.createHistory({
            user_uuid: user.uuid,
            amount,
            type: WalletHistoryTypeEnum.TOPUP,
            description: 'Wallet top-up',
        });

        return;
    }
}