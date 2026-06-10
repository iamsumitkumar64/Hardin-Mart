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

// Payload Types for Catalog Module
export interface UserRegisteredMQEventPayload {
    uuid: string;
    name: string;
    email: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

// Event Payload Discriminated Union
export type CatalogEventPayload =
    | UserRegisteredMQEventPayload;

export const catalogEventPayloadMap: Record<string, any> = {
    'user.registered': UserRegisteredMQEventPayload,
};
