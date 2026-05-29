import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { GetAccountModule } from "./get-wallet/get-wallet.module";
import { GetWalletHistoryModule } from "./get-wallet-history/get-wallet-history.module";
import { AddAmountModule } from "./add-amount/add-amount.module";
import { PayOrderModule } from "./pay-order/pay-order.module";

@Module({
    imports: [
        GetAccountModule,
        GetWalletHistoryModule,
        AddAmountModule,
        PayOrderModule,
        RouterModule.register([
            {
                path: 'wallet',
                children: [
                    { path: '', module: GetAccountModule },
                    { path: '', module: GetWalletHistoryModule },
                    { path: '', module: AddAmountModule },
                    { path: '', module: PayOrderModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class WalletModule { }