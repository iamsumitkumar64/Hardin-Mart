import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "src/module/user-module/infrastructure/repository/user.repository";
import { UserEntity } from "src/module/shipment-module/domain/user/user.entity";
import { UserAddressRepository } from "src/module/shipment-module/infrastructure/repository/user.address.repository";

@Injectable()
export class GetUserAddressService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userAddressRepository: UserAddressRepository,
    ) { }

    async getUserAddress(user: UserEntity) {
        const addresses = await this.userAddressRepository.findByUserUuid(user.uuid);
        return {
            data: addresses,
            message: "User Address fetched successfully"
        };
    }
}