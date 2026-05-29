import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetWalletService } from "./get-wallet.service";

@Controller()
export class GetWalletController {
    constructor(private readonly getWalletService: GetWalletService) { }

    @Get()
    async getWallet(@Req() req: Request) {
        const { data } = await this.getWalletService.getWallet(req.user);

        return {
            data: data,
            message: "Wallet fetched successfully"
        };
    }
}