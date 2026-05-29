import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { UserAddressEntity } from "../../domain/user_address/user.address.entity";

@Injectable()
export class UserAddressRepository extends Repository<UserAddressEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema')
        private readonly dataSource: DataSource,
    ) {
        super(UserAddressEntity, dataSource.createEntityManager());
    }

    async createAddress(body: Partial<UserAddressEntity>) {
        const user = this.create(body);
        return await this.save(user);
    }

    async findByUserUuid(user_uuid: string, is_default?: boolean) {
        const criteria: any = { user_uuid };
        if (typeof is_default === 'boolean') {
            criteria.isDefault = is_default;
        }
        const addresses = await this.find({ where:criteria });
        return addresses;
    }

    async deleteUserAddress(uuid: string) {
        return await this.softDelete(uuid);
    }

    async unsetOtherDefaults(userUuid: string) {
        const defaultAddresses = await this.findByUserUuid(userUuid, true);

        for (const address of defaultAddresses) {
            address.isDefault = false;
            await this.save(address);
        }
    }
}