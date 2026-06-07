export interface Product {
    uuid: string;
    name: string;
    description: string;
    image_url: string;
    price?: string;
    stock?: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface SaleProduct {
    uuid: string;
    price: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface ShipmentProduct {
    uuid: string;
    stock: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

"550e8400-e29b-41d4-a716-446655440001"
export interface ProductResponse<T> {
    data: T[];
    limit: number;
    offset: number;
    totalDocuments: number;
    message: string;
}

export interface ProductState {
    products: Product[];
    catalogProducts: Product[];
    saleProducts: SaleProduct[];
    ShipmentProducts: ShipmentProduct[];
    loading: boolean;
    error: string | null;
    status: "pending" | "succeed" | "rejected";
    limit: number;
    offset: number;
    totalDocuments: number;
}