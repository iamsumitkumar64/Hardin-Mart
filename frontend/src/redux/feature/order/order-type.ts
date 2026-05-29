import { OrderPaymentStatusEnum, OrderStatusEnum } from "@/enum/order.enum";

export interface OrderItem {
    uuid: string;
    order_uuid: string;
    product_uuid: string;
    quantity?: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    id?: string;
}

export interface SaleOrder {
    uuid: string;
    user_uuid: string;
    total_price?: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    id?: string;
}

export interface BillingOrder {
    uuid: string;
    user_uuid: string;
    total_price?: string;
    payment_status: OrderPaymentStatusEnum;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    id?: string;
}

export interface Address {
    uuid: string;
    user_uuid: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface ShipmentOrder {
    uuid: string;
    user_uuid: string;
    address_uuid: string;
    order_status: OrderStatusEnum;
    address: Address;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface OrderResponse {
    data: SaleOrder[] | BillingOrder[] | SaleOrder | BillingOrder | ShipmentOrder | ShipmentOrder[];
    totalDocuments?: number;
    limit?: number;
    offset?: number;
    message: string;
}

export interface CreateOrderPayload {
    total_price: number;
    address_uuid: string;
    items: {
        product_uuid: string;
        quantity: number;
    }[];
}

export interface OrderState {
    saleOrders: SaleOrder[];
    billingOrders: BillingOrder[];
    shipmentOrders: ShipmentOrder[];
    loading: boolean;
    error: string | null;
    status: "pending" | "succeed" | "rejected";
}