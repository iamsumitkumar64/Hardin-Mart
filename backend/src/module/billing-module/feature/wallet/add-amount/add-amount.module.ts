import { Module } from "@nestjs/common";
import { AddAmountService } from "./add-amount.service";
import { AddAmountController } from "./add-amount.controller";
import { WalletHistoryRepository } from "src/module/billing-module/infrastructure/repository/wallet.history.repository";
import { WalletRepository } from "src/module/billing-module/infrastructure/repository/wallet.repository";

@Module({
    imports: [],
    controllers: [AddAmountController],
    providers: [AddAmountService, WalletRepository, WalletHistoryRepository],
    exports: [],
})
export class AddAmountModule { }
