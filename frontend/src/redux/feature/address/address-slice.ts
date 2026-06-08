"use client";

import { createSlice } from "@reduxjs/toolkit";
import { AddressState } from "./address-type";
import { getAddresses, addAddress, deleteAddress } from "./address-action";

const initialState: AddressState = {
    addresses: null,
    loading: false,
    error: null,
    status: "pending",
};

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        resetAddressError: (state) => {
            state.error = null;
            state.status = "pending";
        },
        clearAddressState: (state) => {
            state.addresses = null;
            state.error = null;
            state.status = "pending";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAddresses.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";
                state.addresses = action.payload.data as any[];
                state.error = null;
            })
            .addCase(getAddresses.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";
                if (state.addresses) state.addresses.push(action.payload.data as any);
                else state.addresses = [action.payload.data as any];
                state.error = null;
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";
                if (state.addresses)
                    state.addresses = state.addresses.filter(addr => addr.uuid !== action.payload.uuid);
                state.error = null;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
    },
});

export const { resetAddressError, clearAddressState } = addressSlice.actions;
export default addressSlice.reducer;