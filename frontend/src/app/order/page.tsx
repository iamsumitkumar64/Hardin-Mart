"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Button, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import { RootState, } from "@/redux/store";
import styles from "./order.module.css";
import { getSaleOrders, getBillingOrders, getShipmentOrders } from "@/redux/feature/order/order-action";
import { SaleOrder, OrderItem } from "@/redux/feature/order/order-type";
import { enqueueSnackbar } from "notistack";
import Image from "next/image";
import Slider from "react-slick";
import { sliderSettings } from "../../config/slider";
import { OrderPaymentStatusEnum, OrderStatusEnum } from "@/enum/order.enum";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { payOrder } from "@/redux/feature/wallet/wallet.action";

export default function OrderPage() {
    const dispatch = useAppDispatch();
    const { saleOrders, billingOrders, shipmentOrders, loading } = useAppSelector((state: RootState) => state.orderReducer);
    const { catalogProducts, saleProducts } = useAppSelector((state: RootState) => state.productReducer);
    const [limit] = useState(Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10);
    const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // if (!saleOrders?.length) {
        fetchOrders();
        // }
    }, []);

    const fetchOrders = async () => {
        try {
            const result = await dispatch(getSaleOrders({ limit, offset })).unwrap();
            await dispatch(getBillingOrders({ limit, offset })).unwrap();
            await dispatch(getShipmentOrders({ limit, offset })).unwrap();
            const fetchedOrders = Array.isArray(result.data) ? result.data : [];
            setOffset(prevOffset => prevOffset + limit);
            if (fetchedOrders.length < limit) setHasMore(false);
        } catch (err: any) {
            console.log(err);
            enqueueSnackbar(err, { variant: "warning", });
        }
    };

    const orderSteps = [
        OrderStatusEnum.PLACED,
        OrderStatusEnum.BILLED,
        OrderStatusEnum.SHIPPED,
        OrderStatusEnum.DELIVERED,
    ];

    const getActiveStep = (status: OrderStatusEnum) => {
        return orderSteps.indexOf(status);
    };

    const handlePay = async (order_uuid: string) => {
        try {
            await dispatch(payOrder({ order_uuid })).unwrap();
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
                    dataLength={saleOrders ? saleOrders.length : 0}
                    next={fetchOrders}
                    hasMore={hasMore}
                    loader={<Box className={styles.loader}><CircularProgress /></Box>}
                    endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
                    scrollableTarget="scrollableDiv"
                >
                    {saleOrders && saleOrders.length > 0 ? (
                        saleOrders.map((order: SaleOrder, idx: number) => {
                            const descendingIndex = saleOrders.length - 1 - idx;
                            const billingOrder = billingOrders ? billingOrders.find((item) => item.uuid === order.uuid) : null;
                            const shipmentOrder = shipmentOrders ? shipmentOrders.find((item) => item.uuid === order.uuid) : null;

                            return (
                                <Card key={order.uuid} className={styles.orderCard}>

                                    <Stepper activeStep={getActiveStep((shipmentOrder?.order_status) as OrderStatusEnum)} alternativeLabel className={styles.stepper}>
                                        {orderSteps.map((step) => (
                                            <Step
                                                key={step}
                                                completed={
                                                    shipmentOrder?.order_status === OrderStatusEnum.DELIVERED
                                                        ? true
                                                        : undefined
                                                }
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
                                            Total Price: {billingOrder?.total_price}
                                        </Typography>

                                        {
                                            (
                                                billingOrder?.payment_status == OrderPaymentStatusEnum.PENDING ||
                                                billingOrder?.payment_status == OrderPaymentStatusEnum.FAILED
                                            ) &&
                                            <Button onClick={() => handlePay(order.uuid)}>
                                                Pay
                                            </Button>
                                        }

                                        <Box className={styles.slidercomp}>
                                            <Slider {...sliderSettings}>
                                                {order.items.map((item: OrderItem) => {
                                                    const product = catalogProducts.find((p) => p.uuid === item.product_uuid);
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
                                                                    Price: ${saleProduct?.price || 0}
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
                                                Payment Status: {billingOrder?.payment_status.toUpperCase() || OrderPaymentStatusEnum.PENDING.toUpperCase()}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{ mt: 1, textAlign: "center" }}
                                            >
                                                Order Status: {shipmentOrder?.order_status.toUpperCase() || OrderStatusEnum.PLACED.toUpperCase()}
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