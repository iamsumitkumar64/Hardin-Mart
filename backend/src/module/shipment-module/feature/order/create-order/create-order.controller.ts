import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { CreateOrderService } from "./create-order.handler";
import type { OrderCreatedMQEventPayload } from "src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";

@Controller()
export class CreateOrderController {
    constructor(private readonly createOrderService: CreateOrderService) { }

    @Post()
    async createOrder(@Body() body: OrderCreatedMQEventPayload) {
        await this.createOrderService.handle(body);

        return {
            message: "Order Created Successfully",
        };
    }
}