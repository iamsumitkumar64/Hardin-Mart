
import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { GetRazorPayLinkService } from "./get.razor.pay.link.handler";
import { GetrazorPayLinkDto } from "./get.razor.pay.link.dto";

@Controller()
export class GetRazorPayLinkController {
    constructor(private readonly getRazorPayLinkService: GetRazorPayLinkService) { }

    @Post("/razor/pay/link")
    async GetRazorPayLink(@Req() req: Request, @Body() body: GetrazorPayLinkDto) {
        const { data } = await this.getRazorPayLinkService.handle(body);
        return {
            data: data,
            message: "Razor Pay link Created successfully"
        };
    }
}