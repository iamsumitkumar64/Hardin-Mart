// Payload Types for Billing Module
export interface UserRegisteredMQEventPayload {
    uuid: string;
    name: string;
    email: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface OrderPlacedMQEventPayload {
    order_uuid: string;
    customer_uuid: string;
}

export interface BackOrderedMQEventPayload {
    order_uuid: string;
    customer_uuid: string;
}

export interface OrderCreatedMQEventPayload {
    order_id: number;
    order_uuid: string;
    customer_uuid: string;
    total_price: number;
    address_uuid: string;
    items: {
        id: number;
        uuid: string;
        product_uuid: string;
        quantity: number;
        created_at: Date;
    }[];
    created_at: Date;
}

export interface OrderRefundMQEventPayload {
    order_uuid: string;
    customer_uuid: string;
    reason?: string;
}

export type BillingEventPayloadMap = {
    'user.registered': UserRegisteredMQEventPayload,
    'order.placed': OrderPlacedMQEventPayload,
    'back.ordered': BackOrderedMQEventPayload,
};

// Generic union type
export type BillingEventPayload = BillingEventPayloadMap[keyof BillingEventPayloadMap];

// 1. Define the Handler Function Type
export type EventHandlerFunction<T extends keyof BillingEventPayloadMap> =
    (payload: BillingEventPayloadMap[T]) => Promise<void>;

// 2. Map of exact handler signatures
export type BillingEventHandlerMap = {
    [K in keyof BillingEventPayloadMap]: EventHandlerFunction<K>[];
};