// Payload Types for Catalog Module
export interface UserRegisteredMQEventPayload {
    uuid: string;
    name: string;
    email: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}

export type CatalogEventPayloadMap = {
    'user.registered': UserRegisteredMQEventPayload,
};

// Generic union type
export type CatalogEventPayload = CatalogEventPayloadMap[keyof CatalogEventPayloadMap];

// 1. Define the Handler Function Type
export type EventHandlerFunction<T extends keyof CatalogEventPayloadMap> =
    (payload: CatalogEventPayloadMap[T]) => Promise<void>;

// 2. Map of exact handler signatures
export type CatalogEventHandlerMap = {
    [K in keyof CatalogEventPayloadMap]: EventHandlerFunction<K>[];
};