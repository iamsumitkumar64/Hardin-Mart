import { Controller, Get, Query } from "@nestjs/common";
import { GetMaterializedViewProductListingService } from "./get-product-listing.handler";

@Controller()
export class GetMaterializedViewProductListingController {
    constructor(private readonly getMaterializedViewProductListingService: GetMaterializedViewProductListingService) { }

    @Get('materialized-view')
    async GetMaterializedViewProductListingFromMaterializedView(@Query('offset') offset?: number, @Query('limit') limit?: number) {
        const curr_limit = Number(limit) || Number(process.env.page_limit) || 10;
        const curr_offset = Number(offset) || Number(process.env.page_offset) || 0;
        const { data, total } = await this.getMaterializedViewProductListingService.handle(offset, limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: total,
            message: "Product Materialized View Listing Success"
        }
    }
}