export type ExchangeType = | 'direct' | 'fanout' | 'topic' | 'headers';

export interface PublishHeadersInterface {
    'x-match'?: 'all' | 'any';
    [key: string]: any;
}

export enum RetryMechanismHeaderEnum {
    XREQUEUETRY = 'x-requeue-try'
}

export enum ExchangeTypeEnum {
    DIRECT = 'direct',
    FANOUT = 'fanout',
    TOPIC = 'topic',
    HEADERS = 'headers',
}

export interface RabbitMQConsumerMessage<TPayload = unknown> {
    outbox_uuid: string;
    payload: TPayload;
    event_name: string;
}