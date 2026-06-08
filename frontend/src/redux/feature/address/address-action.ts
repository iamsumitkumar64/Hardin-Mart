"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { AddAddressPayload, UpdateAddressPayload, DeleteAddressPayload, AddressResponse } from "./address-type";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAddresses = createAsyncThunk<
    AddressResponse,
    void,
    { state: RootState }
>("address/getAddresses", async (_, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";
        const res = await fetch(`${API_URL}/api/v1/user/address`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        return result;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const addAddress = createAsyncThunk<
    AddressResponse,
    AddAddressPayload,
    { state: RootState }
>("address/addAddress", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";
        const res = await fetch(`${API_URL}/api/v1/user/address`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        return result;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const deleteAddress = createAsyncThunk<
    { message: string; uuid: string },
    DeleteAddressPayload,
    { state: RootState }
>("address/deleteAddress", async (payload, { getState, rejectWithValue }) => {
    try {
        const token = getState().authReducer.token || "";
        const res = await fetch(`${API_URL}/api/v1/user/address/${payload.uuid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);
        return { message: result.message, uuid: payload.uuid };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});