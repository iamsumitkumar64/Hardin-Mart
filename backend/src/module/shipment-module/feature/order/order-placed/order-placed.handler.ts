import { Inject, Injectable } from "@nestjs/common";
import type { PolicyInterfaceService } from "src/common/infrastruture/policy/policy.interface";
import type { OrderPlacedMQEventPayload } from "src/module/shipment-module/infrastructure/rabbit-mq/rabbit-mq.type";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";
import { runOnTransactionCommit, Transactional } from "typeorm-transactional";

@Injectable()
export class OrderPlacedService {
    constructor(
        private readonly orderRepository: OrderRepository,
        @Inject('POLICY_TOKEN') private readonly policyService: PolicyInterfaceService,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema',
    })
    async handle(order: OrderPlacedMQEventPayload) {
        const orderData = await this.orderRepository.findByUserUuidAndOrderUuid(order.customer_uuid, order.order_uuid);
        if (!orderData) {
            console.log('order not found');
            return;
        }

        await this.orderRepository.updateOrder(order.order_uuid, { is_placed: true });

        await this.policyService.handleSetPolicy(order.order_uuid, { is_placed: true, is_billed: orderData.is_billed, data: { customer_uuid: order.customer_uuid, order_uuid: order.order_uuid } });
        return;
    }
}