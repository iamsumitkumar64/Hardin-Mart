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

// Event Payload Discriminated Union
export type SaleEventPayload =
    | UserRegisteredMQEventPayload
    | OrderBilledMQEventPayload
    | OrderRefundMQEventPayload
    | OrderPaymentFailedMQEventPayload
    | OrderShippingLabelCreatedMQEventPayload;

export const saleEventPayloadMap: Record<string, any> = {
    'user.registered': UserRegisteredMQEventPayload,
    'order.billed': OrderBilledMQEventPayload,
    'order.refund': OrderRefundMQEventPayload,
    'payment.failed': OrderPaymentFailedMQEventPayload,
    'shipping.label.created': OrderShippingLabelCreatedMQEventPayload,
};
