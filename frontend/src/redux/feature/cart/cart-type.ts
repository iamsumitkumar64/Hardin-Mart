export interface CartProduct {
    uuid: string;
    name: string;
    description: string;
    image_url: string;
}

export interface CartItem {
    product_uuid: string;
    quantity: number;
    product?: CartProduct;
}

export interface Cart {
    total_price: string;
    items: CartItem[];
}

export interface CartResponse {
    data: Cart;
    message: string;
}

export interface RemoveCartItemPayload {
    product_uuid: string;
}

export interface AddToCartPayload {
    product_uuid: string;
    quantity: number;
}

export interface UpdateCartItemPayload {
    product_uuid: string;
    quantity: number;
}

export interface CartState {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
    status: "pending" | "succeed" | "rejected";
}