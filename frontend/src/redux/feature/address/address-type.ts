export interface Address {
    uuid: string;
    customer_uuid: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    id?: string;
}

export interface AddressResponse {
    data: Address | Address[];
    message: string;
}

export interface AddAddressPayload {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    is_default?: boolean;
}

export interface UpdateAddressPayload {
    uuid: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    is_default?: boolean;
}

export interface DeleteAddressPayload {
    uuid: string;
}

export interface AddressState {
    addresses: Address[] | null;
    loading: boolean;
    error: string | null;
    status: "pending" | "succeed" | "rejected";
}