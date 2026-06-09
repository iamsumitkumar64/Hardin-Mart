import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { WalletEntity } from "../../domain/wallet/wallet.entity";

@Injectable()
export class WalletRepository extends Repository<WalletEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema')
        private readonly dataSource: DataSource,
    ) {
        super(WalletEntity, dataSource.createEntityManager());
    }

    async findWallet(customer_uuid: string) {
        return await this.findOne({
            where: { customer_uuid },
        });
    }

    async createWallet(payload: Partial<WalletEntity>) {
        const wallet = this.create(payload);
        return await this.save(wallet);
    }

    async saveWallet(wallet: WalletEntity) {
        return await this.save(wallet);
    }

    async updateBalance(uuid: string, balance: number) {
        return await this.update(
            { uuid },
            { balance },
        );
    }

    async upsertWallet(customer_uuid: string) {
        await this.upsert(
            {
                customer_uuid,
            },
            ["customer_uuid"],
        );

        const wallet = await this.findWallet(customer_uuid);
        if (!wallet) {
            throw new Error("Wallet not found after upsert");
        }

        return wallet;
    }
}