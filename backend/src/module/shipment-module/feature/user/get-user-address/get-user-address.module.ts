import { Module } from "@nestjs/common";
import { UserRepository } from "src/module/user-module/infrastructure/repository/user.repository";
import { GetUserAddressController } from "./get-user-address.controller";
import { GetUserAddressService } from "./get-user-address.handler";
import { UserAddressRepository } from "src/module/shipment-module/infrastructure/repository/user.address.repository";

@Module({
    imports: [],
    controllers: [GetUserAddressController],
    providers: [GetUserAddressService, UserRepository, UserAddressRepository],
    exports: [],
})

export class GetUserAddressModule { }