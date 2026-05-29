import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { PayOrderService } from "./pay-order.service";

@Controller()
export class PayOrderController {
    constructor(private readonly payOrderService: PayOrderService) { }

    @Post("/order/pay")
    async PayOrder(@Req() req: Request) {
        await this.payOrderService.payOrder(req.user, req.body);

        return {
            message: "Order Paid successfully"
        };
    }
}