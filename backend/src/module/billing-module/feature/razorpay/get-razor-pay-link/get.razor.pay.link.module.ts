import { Module } from "@nestjs/common";
import { GetRazorPayLinkController } from "./get.razor.pay.link.controller copy";
import { GetRazorPayLinkService } from "./get.razor.pay.link.service";

@Module({
    imports: [],
    controllers: [GetRazorPayLinkController],
    providers: [GetRazorPayLinkService],
    exports: [],
})
export class GetRazorPayLinkModule { }
