import { Body, Controller, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { CreateUserAddressService } from "./create-user-address.service";
import { CreateUserAddressDto } from "./create-user-address.dto";

@Controller('/address')
export class CreateUserAddressController {
    constructor(private readonly createUserAddressService: CreateUserAddressService) { }

    @Post()
    async createUserAddress(@Req() req: Request, @Body() body: CreateUserAddressDto) {
        const { data } = await this.createUserAddressService.createUserAddress(req.user, body);

        return {
            data: data,
            message: "User Address created"
        }
    }
}