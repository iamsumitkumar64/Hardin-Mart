import { Module } from "@nestjs/common";
import { UserRepository } from "src/module/user-module/infrastructure/repository/user.repository";
import { DeleteUserAddressController } from "./delete-user-address.controller";
import { DeleteUserAddressService } from "./delete-user-address.handler";
import { UserAddressRepository } from "src/module/shipment-module/infrastructure/repository/user.address.repository";

@Module({
    imports: [],
    controllers: [DeleteUserAddressController],
    providers: [DeleteUserAddressService, UserRepository, UserAddressRepository],
    exports: [],
})

export class DeleteUserAddressModule { }