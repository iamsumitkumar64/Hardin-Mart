export interface PublishHeadersInterface {
    'x-match'?: 'all' | 'any';
    [key: string]: any;
}

export type ExchangeType = | 'direct' | 'fanout' | 'topic' | 'headers';


// RabbitMQ Payloads down here

export interface RabbitMQConsumerMessage<TPayload = unknown> {
    outbox_uuid: string;
    payload: TPayload;
}

export interface UserRegisteredMQEventPayload {
    uuid: string;
    name: string;
    email: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface OrderCreatedMQEventPayload {
    order_id: number;
    order_uuid: string;
    user_uuid: string;
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

export interface OrderPaidMQEventPayload {
    order_uuid: string;
    user_uuid: string;
}

export interface OrderRefundMQEventPayload {
    order_uuid: string;
    user_uuid: string;
    reason?: string;
}