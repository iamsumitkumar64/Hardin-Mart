"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { AddAmountPayload, AddCardPayload, PayOrderPayload, PayPayload, } from "./wallet.type";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getWallet = createAsyncThunk<
    any,
    void,
    { state: RootState }
>(
    "wallet/get-wallet",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/api/v1/wallet`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const addAmount = createAsyncThunk<
    any,
    AddAmountPayload,
    { state: RootState }
>(
    "wallet/add-amount",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/api/v1/wallet/amount`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const getwalletHistories = createAsyncThunk<
    any,
    void,
    { state: RootState }
>(
    "wallet/get-histories",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/api/v1/wallet/history`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const payOrder = createAsyncThunk<
    any,
    PayOrderPayload,
    { state: RootState }
>(
    "wallet/order/pay",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/api/v1/wallet/order/pay`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
