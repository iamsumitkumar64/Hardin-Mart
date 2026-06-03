import { Module } from "@nestjs/common";
import { GetWalletController } from "./get-wallet.controller";
import { GetWalletService } from "./get-wallet.service";
import { WalletRepository } from "src/module/billing-module/infrastructure/repository/wallet.repository";
import { WalletHistoryRepository } from "src/module/billing-module/infrastructure/repository/wallet.history.repository";

@Module({
    imports: [],
    controllers: [GetWalletController],
    providers: [GetWalletService, WalletRepository, WalletHistoryRepository],
    exports: [],
})
export class GetAccountModule { }
