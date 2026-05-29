export interface WalletWallet {
    uuid: string;
    user_uuid: string;
    balance: number;
    created_at: string;
    updated_at: string;
}

export interface WalletHistory {
    uuid: string;
    user_uuid: string;
    amount: number;
    type: string;
    card_uuid: string | null;
    description: string | null;
    created_at: string;
}

export interface AddCardPayload {
    name_on_card: string;
    card_number: string;
    expiry_month: string;
    expiry_year: string;
}

export interface GetWalletResponse {
    data: WalletWallet;
    message: string;
}

export interface GetHistoriesResponse {
    data: WalletHistory[];
    message: string;
}

export interface AddAmountPayload {
    amount: number;
}

export interface PayOrderPayload {
    order_uuid: string
}

export interface PayPayload {
    amount: number;
    order_uuid: string
}

export interface WalletState {
    wallet: WalletWallet | null;
    histories: WalletHistory[];
    loading: boolean;
    error: string | null;
    status: | "pending" | "succeed" | "rejected";
}