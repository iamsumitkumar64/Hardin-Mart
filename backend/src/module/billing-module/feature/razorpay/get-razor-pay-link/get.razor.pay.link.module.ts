import { Module } from "@nestjs/common";
import { GetRazorPayLinkController } from "./get.razor.pay.link.controller";
import { GetRazorPayLinkService } from "./get.razor.pay.link.handler";

@Module({
    imports: [],
    controllers: [GetRazorPayLinkController],
    providers: [GetRazorPayLinkService],
    exports: [],
})
export class GetRazorPayLinkModule { }
