"use client"

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

//common reducer
import authReducer from "../feature/auth/auth-slice";
import productReducer from "../feature/product/product-slice";
import cartReducer from "../feature/cart/cart-slice";
import orderReducer from "../feature/order/order-slice";
import walletReducer from "../feature/wallet/wallet.slice";
import userAddressReducer from "../feature/address/address.slice";

const persistConfig = {
    key: "root",
    storage,
};

const appReducer = combineReducers({
    authReducer: authReducer,
    productReducer: productReducer,
    cartReducer: cartReducer,
    orderReducer: orderReducer,
    walletReducer: walletReducer,
    userAddressReducer: userAddressReducer,
});

const rootReducer = (state: any, action: any) => {
    if (action.type.includes("auth/logout/fulfilled")) {
        // storage.removeItem("persist:root");
        state = undefined;
    }
    return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;