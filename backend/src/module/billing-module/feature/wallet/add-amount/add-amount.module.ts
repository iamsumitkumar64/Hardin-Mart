import { Module } from "@nestjs/common";
import { BillingRepository } from "src/module/billing-module/infrastructure/repository/billing.repository";
import { AddAmountService } from "./add-amount.service";
import { AddAmountController } from "./add-amount.controller";

@Module({
    imports: [],
    controllers: [AddAmountController],
    providers: [AddAmountService, BillingRepository],
    exports: [],
})
export class AddAmountModule { }
