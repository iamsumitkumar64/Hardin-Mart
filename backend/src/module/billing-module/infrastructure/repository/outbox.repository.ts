import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { OutboxEntity } from "../../domain/outbox/outbox.entity";
import { OutboxStatusEnum } from "../../domain/outbox/outbox.enum";

@Injectable()
export class OutboxRepository extends Repository<OutboxEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema')
        private readonly dataSource: DataSource,
    ) {
        super(OutboxEntity, dataSource.createEntityManager());
    }

    async createOutboxEntry(body: Partial<OutboxEntity>) {
        const entry = this.create(body);
        return await this.save(entry);
    }

    async findTopPendingOutBoxEntries() {
        const entries = await this.find({
            where: {
                status: OutboxStatusEnum.PENDING
            },
            order: {
                created_at: "ASC",
            },
            take: Number(process.env.page_limit) || 10
        });
        return entries;
    }

    async updateStatus(uuid: string, status: OutboxStatusEnum) {
        return await this.update(
            {
                uuid: uuid
            },
            {
                status: status
            }
        )
    }
}