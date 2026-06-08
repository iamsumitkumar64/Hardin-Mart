import { Body, Controller, Patch, Post, Req } from "@nestjs/common";
import { PlaceOrderService } from "./place-order.handler";
import { CreateOrderDto } from "src/module/sale-module/feature/order/create-order/create-order.dto";
import type { Request } from "express";

@Controller()
export class PlaceOrderController {
    constructor(private readonly placeOrderService: PlaceOrderService) { }

    @Patch('place')
    async placeOrder(@Req() req: Request, @Body() body: CreateOrderDto) {
        const { data } = await this.placeOrderService.handle(req, body);

        return {
            data,
            message: "Order placed successfully",
        };
    }
}
