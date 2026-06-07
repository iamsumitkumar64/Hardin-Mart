"use client";

import { createSlice } from "@reduxjs/toolkit";
import { ProductState } from "./product-type";
import { getCatalogProducts, getProducts, getSaleProducts, getShipmentProducts, } from "./product-action";

const initialState: ProductState = {
    products: [],
    catalogProducts: [],
    saleProducts: [],
    ShipmentProducts: [],
    loading: false,
    error: null,
    status: "pending",
    limit: 10,
    offset: 0,
    totalDocuments: 0,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        resetProductError: (state) => {
            state.error = null;
            state.status = "pending";
        },
        updateProductOrder: (
            state,
            action: {
                payload: { product_uuid: string; quantity: number; };
            }
        ) => {
            const productIdx = state.products.findIndex((item) => item.uuid === action.payload.product_uuid);
            if (productIdx != -1) {
                state.products[productIdx].stock = Number(state.products[productIdx].stock || 0) - action.payload.quantity;
            }

            const idx = state.ShipmentProducts.findIndex((item) => item.uuid === action.payload.product_uuid);
            if (idx != -1) {
                state.ShipmentProducts[idx].stock = state.ShipmentProducts[idx].stock - action.payload.quantity;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.offset === 0) {
                    state.products = action.payload.data;
                } else {
                    const merged = [
                        ...state.products,
                        ...action.payload.data,
                    ];

                    state.products = Array.from(
                        new Map(
                            merged.map((item) => [item.uuid, item])
                        ).values()
                    );
                }

                state.limit = action.payload.limit;
                state.offset = action.payload.offset;
                state.totalDocuments = action.payload.totalDocuments;

                state.error = null;
                state.status = "succeed";
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(getCatalogProducts.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getCatalogProducts.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.offset === 0) {
                    state.catalogProducts = action.payload.data;
                } else {
                    const merged = [
                        ...state.catalogProducts,
                        ...action.payload.data,
                    ];

                    state.catalogProducts = Array.from(
                        new Map(
                            merged.map((item) => [item.uuid, item])
                        ).values()
                    );
                }

                state.limit = action.payload.limit;
                state.offset = action.payload.offset;
                state.totalDocuments = action.payload.totalDocuments;

                state.error = null;
                state.status = "succeed";
            })
            .addCase(getCatalogProducts.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })

            .addCase(getSaleProducts.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getSaleProducts.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.offset === 0) {
                    state.saleProducts = action.payload.data;
                } else {
                    const merged = [
                        ...state.saleProducts,
                        ...action.payload.data,
                    ];

                    state.saleProducts = Array.from(
                        new Map(
                            merged.map((item) => [item.uuid, item])
                        ).values()
                    );
                }

                state.error = null;
                state.status = "succeed";
            })
            .addCase(getSaleProducts.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(getShipmentProducts.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.offset === 0) {
                    state.ShipmentProducts = action.payload.data;
                } else {
                    const merged = [
                        ...state.ShipmentProducts,
                        ...action.payload.data,
                    ];

                    state.ShipmentProducts = Array.from(
                        new Map(
                            merged.map((item) => [item.uuid, item])
                        ).values()
                    );
                }

                state.error = null;
                state.status = "succeed";
            })
            .addCase(getShipmentProducts.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            });
    },
});

export const { resetProductError, updateProductOrder } = productSlice.actions;
export default productSlice.reducer;