"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getProducts = createAsyncThunk(
    "product/materialized-view",
    async (
        {
            limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10,
            offset = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0,
        }: { limit?: number; offset?: number },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/v1/shipment/product/materialized-view?limit=${limit}&offset=${offset}`,
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
                `${BACKEND_URL}/api/v1/catalog/product?limit=${limit}&offset=${offset}`,
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
                `${BACKEND_URL}/api/v1/sale/product?limit=${limit}&offset=${offset}`,
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
                `${BACKEND_URL}/api/v1/shipment/product?limit=${limit}&offset=${offset}`,
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