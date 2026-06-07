import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { CreateOrderDto } from "./create-order.dto";
import { CreateOrderService } from "./create-order.handler";

@Controller()
export class CreateOrderController {
    constructor(private readonly createOrderService: CreateOrderService) { }

    @Post()
    async createOrder(@Req() req: Request, @Body() body: CreateOrderDto) {
        const { data } = await this.createOrderService.handle(req.user, body);

        return {
            data: data,
            message: "Order Created Successfully",
        };
    }
}