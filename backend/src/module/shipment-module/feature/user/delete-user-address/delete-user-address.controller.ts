import { Body, Controller, Delete, Param, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { DeleteUserAddressService } from "./delete-user-address.handler";

@Controller('/address')
export class DeleteUserAddressController {
    constructor(private readonly deleteUserAddressService: DeleteUserAddressService) { }

    @Delete("/:uuid")
    async deleteUserAddress(@Req() req: Request, @Param("uuid") uuid: string) {
        await this.deleteUserAddressService.handle(req.user, uuid);
        return {
            message: "User Address deleted successfully"
        };
    }
}