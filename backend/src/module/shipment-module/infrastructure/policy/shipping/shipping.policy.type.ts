export interface ShippingPolicyType {
    is_billed: boolean,
    is_placed: boolean,
    data: OrderShippingLabelCreatedMQEventPayload
}

export interface OrderShippingLabelCreatedMQEventPayload {
    order_uuid: string;
    customer_uuid: string;
}