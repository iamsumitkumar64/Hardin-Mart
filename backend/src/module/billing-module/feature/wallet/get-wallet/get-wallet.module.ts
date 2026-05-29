import { Module } from "@nestjs/common";
import { BillingRepository } from "src/module/billing-module/infrastructure/repository/billing.repository";
import { GetWalletController } from "./get-wallet.controller";
import { GetWalletService } from "./get-wallet.service";

@Module({
    imports: [],
    controllers: [GetWalletController],
    providers: [GetWalletService, BillingRepository],
    exports: [],
})
export class GetAccountModule { }
