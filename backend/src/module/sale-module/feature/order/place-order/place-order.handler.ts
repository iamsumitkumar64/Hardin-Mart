import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "src/module/sale-module/feature/order/create-order/create-order.dto";
import { CreateOrderService } from "src/module/sale-module/feature/order/create-order/create-order.handler";
import { ApiCallService } from "src/module/common/infrastruture/services/api.call.service";
import type { Request } from "express";

@Injectable()
export class PlaceOrderService {
    constructor(
        private readonly createOrderService: CreateOrderService,
    ) { }

    async handle(req: Request, body: CreateOrderDto) {
        const result = await this.createOrderService.handle(req, body);
        const { user, token } = req;
        const API_URL = process.env.BACKEND_URL;
        const billingUrl = `${API_URL}/api/v1/billing/order`;
        const shipmentUrl = `${API_URL}/api/v1/shipment/order`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: token,
        };

        await ApiCallService(billingUrl, 'POST', headers, JSON.stringify({
            order_id: result.data.id,
            order_uuid: result.data.uuid,
            user_uuid: result.data.user_uuid,
            total_price: result.data.total_price,
            address_uuid: body.address_uuid,
            items: result.data.items.map((item: any) => ({
                uuid: item.uuid,
                id: item.id,
                product_uuid: item.product_uuid,
                quantity: item.quantity,
                created_at: item.created_at,
            })),
            created_at: result.data.created_at,
        }));

        await ApiCallService(shipmentUrl, 'POST', headers, JSON.stringify({
            order_id: result.data.id,
            order_uuid: result.data.uuid,
            user_uuid: result.data.user_uuid,
            total_price: result.data.total_price,
            address_uuid: body.address_uuid,
            items: result.data.items.map((item: any) => ({
                uuid: item.uuid,
                id: item.id,
                product_uuid: item.product_uuid,
                quantity: item.quantity,
                created_at: item.created_at,
            })),
            created_at: result.data.created_at,
        }));

        return result;
    }
}
