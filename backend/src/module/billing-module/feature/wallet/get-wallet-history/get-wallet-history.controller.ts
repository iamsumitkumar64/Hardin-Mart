import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetWalletHistoryService } from "./get-wallet-history.handler";

@Controller()
export class GetWalletHistoryController {
    constructor(private readonly GetWalletHistoryService: GetWalletHistoryService) { }

    @Get("/history")
    async getWalletHistory(@Req() req: Request) {
        const { data } = await this.GetWalletHistoryService.handle(req.user);

        return {
            data: data,
            message: "Wallet history fetched successfully"
        };
    }
}