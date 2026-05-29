import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { GetProductListingService } from "./get-product-listing.handler";

@Controller()
export class GetProductListingController {
    constructor(private readonly getProductListingService: GetProductListingService) { }

    @Get()
    async getProductListing(@Query('offset') offset?: number, @Query('limit') limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;
        const { data, total } = await this.getProductListingService.handle(offset, limit);

        return {
            data: data,
            limit: curr_limit,
            offset: curr_offset,
            totalDocuments: total,
            message: "Product Listing Success"
        }
    }
}