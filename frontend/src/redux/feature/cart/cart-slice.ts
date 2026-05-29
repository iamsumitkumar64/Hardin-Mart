"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState, CartItem, AddToCartPayload } from "./cart-type";

const getCartFromStorage = () => {
    if (typeof window === "undefined") return null;

    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : null;
};

const initialState: CartState = {
    cart: getCartFromStorage(),
    loading: false,
    error: null,
    status: "pending",
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetCartError: (state) => {
            state.error = null;
            state.status = "pending";
        },
        clearCartState: (state) => {
            state.cart = null;
            state.error = null;
            state.status = "pending";
            localStorage.removeItem("cart");
        },
        addToCart: (state, action: PayloadAction<CartItem>) => {
            if (!state.cart) {
                state.cart = {
                    total_price: "0",
                    items: [],
                };
            }

            const exists = state.cart.items.find((item) => item.product_uuid === action.payload.product_uuid);
            if (!exists) {
                state.cart.items.unshift(action.payload);
            }
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            if (!state.cart) return;

            state.cart.items = state.cart.items.filter((item) => item.product_uuid !== action.payload);
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        updateCartItemQuantity: (state, action: PayloadAction<AddToCartPayload>) => {
            if (!state.cart) return;

            const item = state.cart.items.find((item) => item.product_uuid === action.payload.product_uuid);
            if (item) {
                item.quantity = action.payload.quantity;
            }
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
    },
});

export const { resetCartError, clearCartState, addToCart, removeCartItem, updateCartItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;