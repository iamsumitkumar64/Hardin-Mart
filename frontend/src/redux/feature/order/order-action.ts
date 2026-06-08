"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { OrderResponse, CreateOrderPayload } from "./order-type";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getSaleOrders = createAsyncThunk<
    OrderResponse,
    { limit?: number; offset?: number },
    { state: RootState }
>(
    "saleOrder/list",
    async (
        {
            limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10,
            offset = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0,
        },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/api/v1/sale/order?limit=${limit}&offset=${offset}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

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

export const getBillingOrders = createAsyncThunk<
    OrderResponse,
    { limit?: number; offset?: number },
    { state: RootState }
>(
    "billingOrder/list",
    async (
        {
            limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10,
            offset = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0,
        },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/api/v1/billing/order?limit=${limit}&offset=${offset}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

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

export const getShipmentOrders = createAsyncThunk<
    OrderResponse,
    { limit?: number; offset?: number },
    { state: RootState }
>(
    "shipmentOrder/list",
    async (
        {
            limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10,
            offset = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0,
        },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/api/v1/shipment/order?limit=${limit}&offset=${offset}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

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

export const getShipmentOrdersMaterialized = createAsyncThunk<
    OrderResponse,
    { limit?: number; offset?: number },
    { state: RootState }
>(
    "shipmentOrder/materialized-list",
    async (
        {
            limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10,
            offset = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0,
        },
        { getState, rejectWithValue }
    ) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${API_URL}/api/v1/shipment/order/materialized-view?limit=${limit}&offset=${offset}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

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

export const createOrder = createAsyncThunk<
    OrderResponse,
    CreateOrderPayload,
    { state: RootState }
>(
    "order/createOrder",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/api/v1/sale/order/place`, {
                method: "PATCH",
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

export const getRazorPayLink = createAsyncThunk<
    any,
    { total_price: number, order_uuid: string },
    { state: RootState }
>(
    "razor/pay/link",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${API_URL}/api/v1/razor/pay/link`, {
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