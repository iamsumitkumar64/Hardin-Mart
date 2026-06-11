// Payload Types for Sale Module
export interface UserRegisteredMQEventPayload {
    uuid: string;
    name: string;
    email: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface OrderBilledMQEventPayload {
    order_uuid: string;
    customer_uuid: string;
}

export interface OrderRefundMQEventPayload {
    order_uuid: string;
    customer_uuid: string;
    reason?: string;
}

export interface OrderPaymentFailedMQEventPayload {
    order_uuid: string;
    customer_uuid: string;
}

export interface OrderShippingLabelCreatedMQEventPayload {
    order_uuid: string;
    customer_uuid: string;
}

export type SaleEventPayloadMap = {
    'user.registered': UserRegisteredMQEventPayload,
    'order.billed': OrderBilledMQEventPayload,
    'order.refund': OrderRefundMQEventPayload,
    'payment.failed': OrderPaymentFailedMQEventPayload,
    'shipping.label.created': OrderShippingLabelCreatedMQEventPayload,
};

// Generic union type
export type SaleEventPayload = SaleEventPayloadMap[keyof SaleEventPayloadMap];

// 1. Define the Handler Function Type
export type EventHandlerFunction<T extends keyof SaleEventPayloadMap> = 
    (payload: SaleEventPayloadMap[T]) => Promise<void>;

// 2. Map of exact handler signatures
export type SaleEventHandlerMap = {
    [K in keyof SaleEventPayloadMap]: EventHandlerFunction<K>[];
};