"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Button, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import { RootState, } from "@/redux/store";
import styles from "./order.module.css";
import { getShipmentOrdersMaterialized, getRazorPayLink } from "@/redux/feature/order/order-action";
import { OrderItem, MaterializedOrder } from "@/redux/feature/order/order-type";
import { enqueueSnackbar } from "notistack";
import Image from "next/image";
import Slider from "react-slick";
import { sliderSettings } from "../../config/slider";
import { OrderPaymentStatusEnum, OrderStatusEnum } from "@/enum/order.enum";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import Razorpay from 'razorpay';
import { clearOrderState } from "@/redux/feature/order/order-slice";

export default function OrderPage() {
    const dispatch = useAppDispatch();
    const { shipmentOrdersMaterialized, loading } = useAppSelector((state: RootState) => state.orderReducer);
    const { products, catalogProducts, saleProducts } = useAppSelector((state: RootState) => state.productReducer);
    const [limit] = useState(Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // if (!saleOrders?.length) {
        dispatch(clearOrderState());
        fetchOrders(0);
        setHasMore(true);
        setOffset(0);
        // }
    }, []);

    const fetchOrders = async (currentOffset = offset) => {
        try {
            const result = await dispatch(getShipmentOrdersMaterialized({ limit, offset: currentOffset })).unwrap();
            const fetchedOrders = Array.isArray(result.data) ? result.data : [];
            setOffset(currentOffset + limit);
            if (fetchedOrders.length < limit) setHasMore(false);
        } catch (err: any) {
            console.log(err);
            enqueueSnackbar(err, { variant: "warning", });
        }
    };

    const orderSteps = [
        OrderStatusEnum.PENDING,
        OrderStatusEnum.PLACED,
        OrderStatusEnum.BILLED,
        OrderStatusEnum.PAYMENT_FAILED,
        OrderStatusEnum.READY_TO_SHIP,
        OrderStatusEnum.CANCELLED,
    ];

    const getActiveStep = (status: OrderStatusEnum) => {
        return orderSteps.indexOf(status);
    };

    const handlePay = async (order_uuid: string) => {
        try {
            const order = shipmentOrdersMaterialized?.find((item) => item.uuid === order_uuid);
            const razorOrder = await dispatch(getRazorPayLink({ total_price: Number(order?.total_price), order_uuid: order_uuid })).unwrap();
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: razorOrder.data.amount,
                currency: razorOrder.data.currency,
                order_id: razorOrder.data.id, // Order ID from backend
                handler: (response: any) => {
                    console.log(response); // Payment details
                    // Send payment details to backend for verification
                    verifyPayment(order_uuid);
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "warning" });
        }
    };

    // local webhook triggered
    const verifyPayment = async (order_uuid: string) => {
        try {
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "warning" });
        }
    };

    return (
        <Container maxWidth="xl" className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h4" className={styles.heading}>
                    Order Listing
                </Typography>

                <Typography className={styles.subHeading}>
                    Infinite Scroll Orders
                </Typography>
            </Box>

            <Box id="scrollableDiv" className={styles.scrollWrapper}>
                <InfiniteScroll
                    dataLength={shipmentOrdersMaterialized ? shipmentOrdersMaterialized.length : 0}
                    next={fetchOrders}
                    hasMore={hasMore}
                    loader={<Box className={styles.loader}><CircularProgress /></Box>}
                    endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
                    scrollableTarget="scrollableDiv"
                >
                    {shipmentOrdersMaterialized && shipmentOrdersMaterialized.length > 0 ? (
                        shipmentOrdersMaterialized.map((order: MaterializedOrder, idx: number) => {
                            const descendingIndex = shipmentOrdersMaterialized.length - 1 - idx;
                            return (
                                <Card key={order.uuid} className={styles.orderCard}>

                                    <Stepper activeStep={getActiveStep((order.order_status || OrderStatusEnum.PENDING) as OrderStatusEnum)} alternativeLabel className={styles.stepper}>
                                        {orderSteps.map((step) => (
                                            <Step
                                                key={step}
                                            // completed={
                                            //     order.order_status === OrderStatusEnum.READY_TO_SHIP
                                            //         ? true
                                            //         : undefined
                                            // }
                                            >
                                                <StepLabel
                                                    // error={billingOrder?.payment_status === OrderPaymentStatusEnum.REFUND && order.returned_from_status === step}
                                                    sx={{
                                                        "& .MuiStepLabel-label": {
                                                            textTransform: "capitalize",
                                                            fontSize: "0.85rem",
                                                        },
                                                    }}
                                                >
                                                    {step}
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>

                                    <Box className={styles.orderLabel}>
                                        # {descendingIndex + 1}
                                    </Box>

                                    <CardContent className={styles.orderDetail}>
                                        <Typography variant="h6">
                                            Order ID: {order.uuid}
                                        </Typography>

                                        <Typography variant="h6">
                                            Total Price: {order.total_price}
                                        </Typography>

                                        {
                                            order?.order_status == OrderStatusEnum.PAYMENT_FAILED
                                            &&
                                            order?.payment_status == OrderPaymentStatusEnum.FAILED
                                            &&
                                            <Button onDoubleClick={() => handlePay(order.uuid)}>
                                                Pay
                                            </Button>
                                        }

                                        <Box className={styles.slidercomp}>
                                            <Slider {...sliderSettings}>
                                                {order.items && order.items.map((item: OrderItem) => {
                                                    const product = products.find((p) => p.uuid === item.product_uuid) || catalogProducts.find((p) => p.uuid === item.product_uuid);
                                                    const saleProduct = saleProducts.find((p) => p.uuid === item.product_uuid);

                                                    return (
                                                        <Card key={item.uuid} className={styles.itemCard}>
                                                            <Box className={styles.imageWrapper}>
                                                                <Image
                                                                    width={200}
                                                                    height={100}
                                                                    src={product?.image_url || ""}
                                                                    alt={product?.name || ""}
                                                                    className={styles.itemImage}
                                                                />
                                                            </Box>

                                                            <Box className={styles.itemContent}>
                                                                <Typography variant="subtitle1">
                                                                    {product?.name}
                                                                </Typography>

                                                                <Typography variant="body2">
                                                                    Quantity: {item.quantity}
                                                                </Typography>

                                                                <Typography variant="body2">
                                                                    Price: ${product?.price || saleProduct?.price || 0}
                                                                </Typography>
                                                            </Box>
                                                        </Card>
                                                    );
                                                })}
                                            </Slider>
                                        </Box>

                                        <Box className={styles.orderDetailMetaData}>
                                            <Typography
                                                variant="body2"
                                                sx={{ mt: 1, textAlign: "center" }}
                                            >
                                                Payment Status: {order.payment_status?.toUpperCase() || OrderPaymentStatusEnum.PENDING.toUpperCase()}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{ mt: 1, textAlign: "center" }}
                                            >
                                                Order Status: {order.order_status?.toUpperCase() || OrderStatusEnum.PLACED.toUpperCase()}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );

                        })
                    ) : (!loading && <Typography>No Orders Found</Typography>)}
                </InfiniteScroll>
            </Box>
        </Container>
    );
}