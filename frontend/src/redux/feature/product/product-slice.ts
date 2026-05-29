"use client";

import { createSlice } from "@reduxjs/toolkit";
import { ProductState } from "./product-type";
import { getCatalogProducts, getSaleProducts, getShipmentProducts, } from "./product-action";

const initialState: ProductState = {
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
    },
    extraReducers: (builder) => {
        builder
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

export const { resetProductError } = productSlice.actions;
export default productSlice.reducer;