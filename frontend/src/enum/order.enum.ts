export enum OrderPaymentStatusEnum {
    PENDING = 'pending',
    PAID = 'paid',
    CANCELLED = 'cancelled',
    REFUND = 'refund',
    FAILED = 'failed',
}

export enum OrderStatusEnum {
    PLACED = 'placed',
    BILLED = 'billed',
    READY_TO_SHIP = 'ready_to_ship',
    CANCELLED = 'cancelled',
}