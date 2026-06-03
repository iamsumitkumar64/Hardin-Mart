import { Body, Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { GetUserAddressService } from "./get-user-address.service";

@Controller('/address')
export class GetUserAddressController {
    constructor(private readonly getUserAddressService: GetUserAddressService) { }

    @Get()
    async getUserAddress(@Req() req: Request) {
        const { data } = await this.getUserAddressService.getUserAddress(req.user);
        return {
            data: data,
            message: "User Address fetched successfully"
        };
    }
}