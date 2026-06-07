import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetWalletService } from "./get-wallet.handler";

@Controller()
export class GetWalletController {
    constructor(private readonly getWalletService: GetWalletService) { }

    @Get()
    async getWallet(@Req() req: Request) {
        const { data } = await this.getWalletService.handle(req.user);

        return {
            data: data,
            message: "Wallet fetched successfully"
        };
    }
}