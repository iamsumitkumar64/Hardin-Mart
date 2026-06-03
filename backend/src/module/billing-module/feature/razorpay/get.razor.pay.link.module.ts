import { Module } from "@nestjs/common";
import { GetRazorPayLinkModule } from "./get-razor-pay-link/get.razor.pay.link.module";

@Module({
    imports: [GetRazorPayLinkModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class RazorPayModule { }
