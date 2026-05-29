import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { WalletEntity } from "../../domain/wallet/wallet.entity";
import { WalletHistoryEntity } from "../../domain/wallet-history/wallet-history.entity";

@Injectable()
export class BillingRepository {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema')
        private readonly dataSource: DataSource,
    ) { }

    getWalletRepository() {
        return this.dataSource.getRepository(WalletEntity);
    }

    getHistoryRepository() {
        return this.dataSource.getRepository(WalletHistoryEntity);
    }

    async findWallet(user_uuid: string) {
        return await this.getWalletRepository().findOne({ where: { user_uuid } });
    }

    async createWallet(payload: Partial<WalletEntity>) {
        const WalletRepository = this.getWalletRepository();
        const Wallet = WalletRepository.create(payload);
        return await WalletRepository.save(Wallet);
    }

    async saveWallet(wallet: WalletEntity) {
        return await this.getWalletRepository().save(wallet);
    }

    async createHistory(payload: Partial<WalletHistoryEntity>) {
        const historyRepository = this.getHistoryRepository();
        const history = historyRepository.create(payload);
        return await historyRepository.save(history);
    }

    async findHistories(user_uuid: string) {
        return await this.getHistoryRepository().find({
            where: { user_uuid },
            order: { created_at: "DESC" }
        });
    }
}
