import { Injectable } from "@nestjs/common";
import { OrderShippingLabelCreatedMQEventPayload, ShippingPolicyType } from "./shipping.policy.type";
import { OutboxRepository } from "../../repository/outbox.repository";
import { PolicyClass } from "src/common/infrastruture/policy/policy.abstract";
import { OrderPublishEventEnum } from "src/module/shipment-module/domain/order/order.event";

@Injectable()
export class ShippingPolicyService implements PolicyClass {
    protected policyMap = new Map<string, any>();
    protected readonly SHIPPING_EXCHANGE = 'shipping.exchange';
    protected readonly BILLING_EXCHANGE = 'billing.exchange';
    protected readonly USER_EXCHANGE = 'user.exchange';
    protected readonly SALE_EXCHANGE = 'sale.exchange';

    constructor(
        private readonly outboxRepository: OutboxRepository,
    ) { }

    async handleSetPolicy(key: string, policy: ShippingPolicyType) {
        this.policyMap.set(key, policy);
        await this.handleProcess(key);
        return;
    }

    handleGetPolicy(key: string) {
        const shippingPolicy = this.policyMap.get(key);
        if (!shippingPolicy) {
            console.log(`ShippingPolicy with key ${key} not found`);
            return;
        }

        return shippingPolicy;
    }

    handleRemovePolicy(key: string) {
        this.policyMap.delete(key);
        return;
    }

    async handleProcess(key: string) {
        const policy = this.handleGetPolicy(key);
        if (policy && policy.is_billed && policy.is_placed) {
            await this.outboxRepository.createOutboxEntry({
                exchange_name: this.SHIPPING_EXCHANGE,
                event_name: OrderPublishEventEnum.SHIPPING_LABEL_ORDERED,
                message_payload: {
                    order_uuid: policy.data.order_uuid,
                    customer_uuid: policy.data.customer_uuid,
                },
            });
            this.handleRemovePolicy(key);
        }
        return;
    }
}