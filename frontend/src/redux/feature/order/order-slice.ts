"use client";

import { createSlice } from "@reduxjs/toolkit";
import { BillingOrder, SaleOrder, OrderState, ShipmentOrder, OrderResponse } from "./order-type";
import { createOrder, getBillingOrders, getSaleOrders, getShipmentOrders } from "./order-action";
import { OrderPaymentStatusEnum, OrderStatusEnum } from "@/enum/order.enum";

const initialState: OrderState = {
    saleOrders: [],
    billingOrders: [],
    shipmentOrders: [],
    loading: false,
    error: null,
    status: "pending",
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrderError: (state) => {
            state.error = null;
            state.status = "pending";
        },
        clearOrderState: (state) => {
            state.saleOrders = [];
            state.billingOrders = [];
            state.shipmentOrders = [];
            state.error = null;
            state.status = "pending";
        },
        updateBillingOrderStatus: (
            state,
            action: {
                payload: { order_uuid: string; payment_status: OrderPaymentStatusEnum; };
            }
        ) => {
            const order = state.billingOrders.find((item) => item.uuid === action.payload.order_uuid);
            if (order) {
                order.payment_status = action.payload.payment_status;
            }
        },
        updateShipmentOrderStatus: (
            state,
            action: {
                payload: { order_uuid: string; order_status: OrderStatusEnum; };
            }
        ) => {
            const order = state.shipmentOrders.find((item) => item.uuid === action.payload.order_uuid);
            if (order) {
                order.order_status = action.payload.order_status;
            }
        },
        newBillingOrder: (
            state,
            action: {
                payload: { order: BillingOrder };
            }
        ) => {
            const newOrder = action.payload.order as BillingOrder;
            state.billingOrders.unshift(newOrder);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSaleOrders.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getSaleOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";

                const newOrders = action.payload.data as SaleOrder[];

                if (state.saleOrders) {
                    const uuids = new Set(
                        state.saleOrders.map((order) => order.uuid)
                    );

                    const filteredOrders = newOrders.filter(
                        (order) => !uuids.has(order.uuid)
                    );

                    state.saleOrders = [
                        ...state.saleOrders,
                        ...filteredOrders,
                    ];
                } else {
                    state.saleOrders = newOrders;
                }

                state.error = null;
            })
            .addCase(getSaleOrders.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(getBillingOrders.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getBillingOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";

                const newOrders = action.payload.data as BillingOrder[];

                if (state.billingOrders) {
                    const uuids = new Set(
                        state.billingOrders.map((order) => order.uuid)
                    );

                    const filteredOrders = newOrders.filter(
                        (order) => !uuids.has(order.uuid)
                    );

                    state.billingOrders = [
                        ...state.billingOrders,
                        ...filteredOrders,
                    ];
                } else {
                    state.billingOrders = newOrders;
                }

                state.error = null;
            })
            .addCase(getBillingOrders.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(getShipmentOrders.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getShipmentOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";

                const newOrders = action.payload.data as ShipmentOrder[];
                const uuids = new Set(state.shipmentOrders.map((order) => order.uuid));
                const filteredOrders = newOrders.filter((order) => !uuids.has(order.uuid));

                state.shipmentOrders = [
                    ...state.shipmentOrders,
                    ...filteredOrders,
                ];

                state.error = null;
            })
            .addCase(getShipmentOrders.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            })
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeed";

                const order = action.payload.data as SaleOrder;

                if (state.saleOrders) {
                    state.saleOrders.unshift(order);
                } else {
                    state.saleOrders = [order];
                }

                state.error = null;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            });
    },
});

export const { resetOrderError, clearOrderState, updateBillingOrderStatus, updateShipmentOrderStatus, newBillingOrder } = orderSlice.actions;
export default orderSlice.reducer;