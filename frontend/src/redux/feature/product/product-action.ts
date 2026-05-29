"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getCatalogProducts = createAsyncThunk(
    "product/catalog",
    async (
        {
            limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10,
            offset = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0,
        }: { limit?: number; offset?: number },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetch(
                `${API_URL}/catalog/product?limit=${limit}&offset=${offset}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
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

export const getSaleProducts = createAsyncThunk(
    "product/sale",
    async (
        {
            limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10,
            offset = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0,
        }: { limit?: number; offset?: number },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetch(
                `${API_URL}/sale/product?limit=${limit}&offset=${offset}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
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

export const getShipmentProducts = createAsyncThunk(
    "product/shipment",
    async (
        {
            limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10,
            offset = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0,
        }: { limit?: number; offset?: number },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetch(
                `${API_URL}/shipment/product?limit=${limit}&offset=${offset}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
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