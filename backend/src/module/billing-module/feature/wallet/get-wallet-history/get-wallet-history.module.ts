import { Module } from "@nestjs/common";
import { GetWalletHistoryController } from "./get-wallet-history.controller";
import { GetWalletHistoryService } from "./get-wallet-history.handler";
import { WalletHistoryRepository } from "src/module/billing-module/infrastructure/repository/wallet.history.repository";
import { WalletRepository } from "src/module/billing-module/infrastructure/repository/wallet.repository";

@Module({
    imports: [],
    controllers: [GetWalletHistoryController],
    providers: [GetWalletHistoryService, WalletRepository, WalletHistoryRepository],
    exports: [],
})
export class GetWalletHistoryModule { }
