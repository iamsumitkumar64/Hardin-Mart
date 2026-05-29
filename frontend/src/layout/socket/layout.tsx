"use client"
import { SocketEventNameEnum } from "@/enum/socket.enum";
import { updateBillingOrderStatus, updateShipmentOrderStatus } from "@/redux/feature/order/order-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { connectSocket, disconnectSocket } from "@/service/socket";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

export default function RootSocketListener() {
    const { token } = useAppSelector((state: RootState) => state.authReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (token) {
            const socket = connectSocket(token);

            socket.on(SocketEventNameEnum.ORDER__PAYMENT_STATUS_CHANGED, (message) => {
                enqueueSnackbar(`Order paid`, { variant: "info" });
                console.log(message);
                dispatch(updateBillingOrderStatus(message));
            });

            socket.on(SocketEventNameEnum.ORDER_STATUS_CHANGED, (message) => {
                enqueueSnackbar(`Order paid`, { variant: "info" });
                console.log(message);
                dispatch(updateShipmentOrderStatus(message));
            });

            return () => {
                disconnectSocket();
            };
        }
    }, [token, dispatch]);

    return null;
}