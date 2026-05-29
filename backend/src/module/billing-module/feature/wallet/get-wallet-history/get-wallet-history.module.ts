import { Module } from "@nestjs/common";
import { BillingRepository } from "src/module/billing-module/infrastructure/repository/billing.repository";
import { GetWalletHistoryController } from "./get-wallet-history.controller";
import { GetWalletHistoryService } from "./get-wallet-history.service";

@Module({
    imports: [],
    controllers: [GetWalletHistoryController],
    providers: [GetWalletHistoryService, BillingRepository],
    exports: [],
})
export class GetWalletHistoryModule { }
