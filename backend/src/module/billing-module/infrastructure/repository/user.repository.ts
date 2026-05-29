import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { UserEntity } from "../../domain/user/user.entity";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema')
        private readonly dataSource: DataSource,
    ) {
        super(UserEntity, dataSource.createEntityManager());
    }

    async register(body: Partial<UserEntity>) {
        const user = this.create(body);
        return await this.save(user);
    }

    async findByUuid(uuid: string) {
        const user = await this.find({
            where: {
                uuid: uuid
            },
            select: {
                email: true,
                name: true,
                uuid: true,
            }
        });
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.find({
            where: {
                email: email
            },
            select: {
                email: true,
                name: true,
                uuid: true,
            }
        });
        return user;
    }
}