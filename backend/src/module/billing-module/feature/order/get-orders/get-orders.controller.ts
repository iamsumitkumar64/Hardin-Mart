import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GetOrderListingService } from "./get-orders.handler";
import type { Request } from "express";

@Controller()
export class GetOrderListingController {
    constructor(private readonly getOrderListingService: GetOrderListingService) { }

    @Get()
    async getOrderListing(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const { data, totalDocuments } = await this.getOrderListingService.handle(req.user, offset, limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: totalDocuments,
            message: "Order Listing Success"
        }
    }
}