export type ExchangeType = | 'direct' | 'fanout' | 'topic' | 'headers';

export interface PublishHeadersInterface {
    'x-match'?: 'all' | 'any';
    [key: string]: any;
}

export interface RabbitMQConsumerMessage<TPayload = unknown> {
    outbox_uuid: string;
    payload: TPayload;
    event_name: string;
}

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

// Event Payload Discriminated Union
export type ShipmentEventPayload =
    | UserRegisteredMQEventPayload
    | OrderPlacedMQEventPayload
    | OrderBilledMQEventPayload;

export const shipmentEventPayloadMap: Record<string, any> = {
    'user.registered': UserRegisteredMQEventPayload,
    'order.placed': OrderPlacedMQEventPayload,
    'order.billed': OrderBilledMQEventPayload,
};
