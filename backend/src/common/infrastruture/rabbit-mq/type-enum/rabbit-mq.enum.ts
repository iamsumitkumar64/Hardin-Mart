export enum ExchangeTypeEnum {
    DIRECT = 'direct',
    FANOUT = 'fanout',
    TOPIC = 'topic',
    HEADERS = 'headers',
}

export enum XMatchHeaderEnum {
    ALL = 'all',
    ANY = 'any'
}

export enum RetryMechanismHeaderEnum {
    XREQUEUETRY = 'x-requeue-try'
}

// which exchange belong to
export enum ExchangeNameEnum {
    USER_EXCHANGE = 'user.exchange',

    SALE_EXCHANGE = 'sale.exchange',

    BILLING_EXCHANGE = 'billing.exchange',

    SHIPPING_EXCHANGE = 'shipping.exchange',
}

// routing key
export enum RoutingKeyEnum {
    // USER_EXCHANGE
    USER_REGISTERED = 'user.registered',

    // SALE_EXCHANGE
    ORDER_PLACED = 'order.placed',

    // BILLING_EXCHANGE
    ORDER_BILLED = 'order.billed',
    ORDER_REFUND = 'order.refund',
    PAYMENT_FAILED = 'payment.failed',

    // SHIPPING_EXCHANGE
    SHIPPING_LABEL_CREATED = 'shipping.label.created',
    BACK_ORDERED = 'back.ordered',
}

// queue name (module name) + routing key + endfix(queue)
export enum QueueEnum {
    // USER_REGISTERED Key
    CATALOG_USER_REGISTERED_QUEUE = 'catalog.user.registered.queue',
    SALE_USER_REGISTERED_QUEUE = 'sale.user.registered.queue',
    BILLING_USER_REGISTERED_QUEUE = 'billing.user.registered.queue',
    SHIPMENT_USER_REGISTERED_QUEUE = 'shipment.user.registered.queue',

    // ORDER_BILLED Key
    SHIPMENT_ORDER_BILLED_QUEUE = 'shipment.order.billed.queue',
    SALE_ORDER_BILLED_QUEUE = 'sale.order.billed.queue',

    // ORDER_REFUND Key
    SALE_ORDER_REFUND_QUEUE = 'sale.order.refund.queue',

    // ORDER_PLACED Key
    BILLING_ORDER_PLACED_QUEUE = 'billing.order.placed.queue',
    SHIPMENT_ORDER_PLACED_QUEUE = 'shipment.order.placed.queue',

    // SHIPPING_LABEL_CREATED Key
    SALE_SHIPPING_LABEL_CREATED_QUEUE = 'sale.shipping.label.created.queue',

    // BACK_ORDERED Key
    BILLING_BACK_ORDERED_QUEUE = 'billing.back.ordered.queue',

    // PAYMENT_FAILED
    SALE_PAYMENT_FAILED_QUEUE = 'sale.payment.failed.queue',
}
