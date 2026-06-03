import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { WalletHistoryEntity } from "../../domain/wallet-history/wallet-history.entity";

@Injectable()
export class WalletHistoryRepository extends Repository<WalletHistoryEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema')
        private readonly dataSource: DataSource,
    ) {
        super(WalletHistoryEntity, dataSource.createEntityManager());
    }

    async createHistory(payload: Partial<WalletHistoryEntity>) {
        const history = this.create(payload);
        return await this.save(history);
    }

    async findHistories(user_uuid: string) {
        return await this.find({
            where: {
                user_uuid,
            },
            order: {
                created_at: "DESC",
            },
        });
    }

    async findHistoryByOrderUuid(order_uuid: string) {
        return await this.findOne({
            where: {
                order_uuid,
            },
        });
    }
}