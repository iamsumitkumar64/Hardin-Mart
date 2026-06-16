import { Controller, Get, Query, Req } from "@nestjs/common";
import { GetMaterializedViewOrderListingService } from "./get-order-listing.handler";
import type { Request } from "express";

@Controller()
export class GetMaterializedViewOrderListingController {
    constructor(private readonly getMaterializedViewOrderListingService: GetMaterializedViewOrderListingService) { }

    @Get('materialized-view')
    async GetMaterializedViewOrderListingFromMaterializedView(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        const curr_limit = Number(limit) || Number(process.env.page_limit) || 10;
        const curr_offset = Number(offset) || Number(process.env.page_offset) || 0;
        const { data, total } = await this.getMaterializedViewOrderListingService.handle(req.user, offset, limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: total,
            message: "Order Materialized View Listing Success"
        }
    }
}