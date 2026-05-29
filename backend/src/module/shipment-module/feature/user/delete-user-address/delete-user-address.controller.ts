import { Body, Controller, Delete, Param, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { DeleteUserAddressService } from "./delete-user-address.service";

@Controller('/address')
export class DeleteUserAddressController {
    constructor(private readonly deleteUserAddressService: DeleteUserAddressService) { }

    @Delete("/:uuid")
    async deleteUserAddress(@Req() req: Request, @Param("uuid") uuid: string) {
        return this.deleteUserAddressService.deleteUserAddress(req.user, uuid);
    }
}