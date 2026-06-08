import { Controller, Param, Patch } from "@nestjs/common";
import { PlaceOrderService } from "./place-order.handler";

@Controller()
export class PlaceOrderController {
    constructor(private readonly placeOrderService: PlaceOrderService) { }

    @Patch(':uuid/place')
    async placeOrder(@Param('uuid') uuid: string) {
        const data = await this.placeOrderService.handle(uuid);
        return {
            data,
            message: "Order placed successfully",
        };
    }
}
