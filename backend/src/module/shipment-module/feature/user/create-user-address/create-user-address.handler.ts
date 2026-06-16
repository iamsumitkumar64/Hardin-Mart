import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "src/module/user-module/infrastructure/repository/user.repository";
import { CreateUserAddressDto } from "./create-user-address.dto";
import { UserEntity } from "src/module/shipment-module/domain/user/user.entity";
import { UserAddressRepository } from "src/module/shipment-module/infrastructure/repository/user.address.repository";

@Injectable()
export class CreateUserAddressService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userAddressRepository: UserAddressRepository,
    ) { }

    async handle(user: UserEntity, body: CreateUserAddressDto) {
        if (body.is_default) {
            await this.userAddressRepository.unsetOtherDefaults(user.uuid);
        }

        const data = await this.userAddressRepository.createAddress({
            ...body,
            customer_uuid: user.uuid,
        });

        return {
            data: data,
        }
    }
}