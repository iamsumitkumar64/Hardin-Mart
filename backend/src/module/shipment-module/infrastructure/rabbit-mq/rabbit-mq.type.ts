// Payload Types for Shipment Module
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

export interface OrderBilledMQEventPayload {
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

// Map types
export type ShipmentEventPayloadMap = {
    'user.registered': UserRegisteredMQEventPayload;
    'order.placed': OrderPlacedMQEventPayload;
    'order.billed': OrderBilledMQEventPayload;
};

// Generic union type
export type ShipmentEventPayload = ShipmentEventPayloadMap[keyof ShipmentEventPayloadMap];

// 1. Define the Handler Function Type
export type EventHandlerFunction<T extends keyof ShipmentEventPayloadMap> =
    (payload: ShipmentEventPayloadMap[T]) => Promise<void>;

// 2. Map of exact handler signatures
export type ShipmentEventHandlerMap = {
    [K in keyof ShipmentEventPayloadMap]: EventHandlerFunction<K>[];
};