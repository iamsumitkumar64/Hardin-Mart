import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { OutboxEntity } from "../../domain/outbox/outbox.entity";
import { OutboxStatusEnum } from "../../domain/outbox/outbox.enum";

@Injectable()
export class OutboxRepository extends Repository<OutboxEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_USER_SCHEMA || 'user_schema')
        private readonly dataSource: DataSource,
    ) {
        super(OutboxEntity, dataSource.createEntityManager());
    }

    async createOutboxntry(body: Partial<OutboxEntity>) {
        const user = this.create(body);
        return await this.save(user);
    }

    async findTopTenPendingOutBoxEntries() {
        const mails = await this.find({
            where: {
                status: OutboxStatusEnum.PENDING
            },
            order: {
                created_at: "DESC",
            },
            take: Number(process.env.page_limit) || 10
        });
        return mails;
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