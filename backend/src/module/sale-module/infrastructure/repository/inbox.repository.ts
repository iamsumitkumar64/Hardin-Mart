import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { InboxEntity } from "../../domain/inbox/inbox.entity";

@Injectable()
export class InboxRepository extends Repository<InboxEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema')
        private readonly dataSource: DataSource,
    ) {
        super(InboxEntity, dataSource.createEntityManager());
    }

    async createEntry(body: Partial<InboxEntity>) {
        const entry = this.create(body);
        return await this.save(entry);
    }

    async findByOutboxUuid(uuid: string) {
        const entry = await this.findOne({
            where: {
                uuid: uuid
            }
        });
        return entry;
    }
}