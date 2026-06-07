import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { PayOrderService } from "./pay-order.handler";

@Controller()
export class PayOrderController {
    constructor(private readonly payOrderService: PayOrderService) { }

    @Post("/order/pay")
    async PayOrder(@Req() req: Request) {
        await this.payOrderService.handle(req.user.uuid, req.body);

        return {
            message: "Order Paid successfully"
        };
    }
}