import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AddAmountService } from "./add-amount.handler";

@Controller()
export class AddAmountController {
    constructor(private readonly addAmountService: AddAmountService) { }

    @Post("/amount")
    async addAmount(@Req() req: Request) {
        await this.addAmountService.handle(req.user, req.body);

        return {
            message: "Amount added successfully"
        };
    }
}