import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "src/module/user-module/infrastructure/repository/user.repository";
import { UserEntity } from "src/module/shipment-module/domain/user/user.entity";
import { UserAddressRepository } from "src/module/shipment-module/infrastructure/repository/user.address.repository";

@Injectable()
export class DeleteUserAddressService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userAddressRepository: UserAddressRepository,
    ) { }

    async handle(user: UserEntity, uuid: string) {
        await this.userAddressRepository.deleteUserAddress(uuid);
        return;
    }
}