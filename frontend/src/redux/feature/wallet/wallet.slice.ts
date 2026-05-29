"use client";

import { createSlice } from "@reduxjs/toolkit";
import { addAmount, getWallet, getwalletHistories } from "./wallet.action";
import { WalletState } from "./wallet.type";

const initialState: WalletState = {
    wallet: null,
    histories: [],
    loading: false,
    error: null,
    status: "pending",
};

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        resetWalletError: (state) => {
            state.error = null;
            state.status = "pending";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWallet.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getWallet.fulfilled, (state, action) => {
                state.loading = false;
                state.wallet = action.payload.data;
                state.status = "succeed";
                state.error = null;
            })
            .addCase(getWallet.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(addAmount.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(addAmount.fulfilled, (state, action) => {
                state.loading = false;
                state.wallet = action.payload.data;
                state.status = "succeed";
                state.error = null;
            })
            .addCase(addAmount.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(getwalletHistories.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getwalletHistories.fulfilled, (state, action) => {
                state.loading = false;
                state.histories = action.payload.data;
                state.status = "succeed";
                state.error = null;
            })
            .addCase(getwalletHistories.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            });
    },
});

export const { resetWalletError } = walletSlice.actions;
export default walletSlice.reducer;