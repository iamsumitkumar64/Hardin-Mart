"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardMedia, Container, IconButton, Typography, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./cart.module.css";
import { RootState } from "@/redux/store";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { CartItem } from "@/redux/feature/cart/cart-type";
import { clearCartState, removeCartItem, updateCartItemQuantity, } from "@/redux/feature/cart/cart-slice";
import { createOrder } from "@/redux/feature/order/order-action";
import { getAddresses } from "@/redux/feature/address/address-action";
import UserAddressModal from "@/component/user-address-modal/user-address-modal";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector((state: RootState) => state.cartReducer);
    const { products, saleProducts, ShipmentProducts } = useAppSelector((state: RootState) => state.productReducer);
    const { user } = useAppSelector((state: RootState) => state.authReducer);
    const [openUserAddressModal, setOpenUserAddressModal] = useState(false);

    const handleRemoveItem = async (product_uuid: string) => {
        try {
            dispatch(removeCartItem(product_uuid));
            enqueueSnackbar("Item removed from cart", { variant: "success" });
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "warning" });
        }
    };

    const handleClearCart = async () => {
        try {
            dispatch(clearCartState());
            enqueueSnackbar("Cart deleted", { variant: "success", });
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "warning", });
        }
    };

    const handleUpdateQuantity = async (product_uuid: string, quantity: number) => {
        if (quantity < 1) return;

        try {
            dispatch(updateCartItemQuantity({ product_uuid, quantity }));
            enqueueSnackbar("Cart updated", { variant: "success" });
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "warning" });
        }
    };

    const handlePlaceOrder = async (address_uuid: string) => {
        try {
            if (!cart?.items?.length) {
                enqueueSnackbar("Cart is empty", {
                    variant: "warning",
                });
                return;
            }

            const payload = {
                total_price: cart.items.reduce((total, item) => {
                    const product = products.find((product) => product.uuid === item.product_uuid);
                    const saleProduct = saleProducts.find((product) => product.uuid === item.product_uuid);
                    return total + (
                        Number(product?.price || item.product?.price || saleProduct?.price || 0) * item.quantity
                    );
                }, 0),
                address_uuid,
                items: cart.items.map((item) => ({
                    product_uuid: item.product_uuid,
                    quantity: item.quantity,
                })),
            };

            await dispatch(createOrder(payload)).unwrap();
            dispatch(clearCartState());
            setOpenUserAddressModal(false);
            enqueueSnackbar("Order placed successfully", { variant: "success", });
        } catch (error: any) {
            enqueueSnackbar(error, { variant: "error", });
        }
    };

    const fetchAddresses = async () => {
        try {
            await dispatch(getAddresses()).unwrap();
        } catch (err: any) {
            console.log("Error fetching addresses:", err);
        }
    };

    const handleAddAddressClose = () => {
        setOpenUserAddressModal(false);
        setTimeout(() => {
            fetchAddresses();
        }, 500);
    };

    return (
        <Container maxWidth="xl" className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h4" className={styles.heading}>
                    Cart
                </Typography>

                <Typography className={styles.subHeading}>
                    Infinite Scroll Products
                </Typography>
            </Box>
            {/* 
            {loading && (
                <Box className={styles.loader}>
                    <CircularProgress size={30} />
                </Box>
            )} */}

            {!loading && (!cart?.items || cart.items.length === 0) && (
                <Box className={styles.emptyWrapper}>
                    <Typography className={styles.emptyText}>
                        Cart is empty
                    </Typography>
                </Box>
            )}

            {/* {!!cart?.items?.length && (
                <Button
                    color="error"
                                    // onClick={handleDeleteCart}
                >
                    Delete Cart
                </Button>
            )} */}

            {cart && cart?.items?.length > 0 && (
                <Box className={styles.productWrapper}>
                    {cart.items.map((item: CartItem) => {
                        const product = products.find((product) => product.uuid === item.product_uuid);
                        const saleProduct = saleProducts.find((product) => product.uuid === item.product_uuid);
                        const shipmentProduct = ShipmentProducts ? ShipmentProducts.find((product) => product.uuid === item.product_uuid) : null;
                        const price = product?.price || item.product?.price || saleProduct?.price || 0;
                        const stock = product?.stock ?? item.product?.stock ?? shipmentProduct?.stock ?? 0;

                        return (
                            <Card key={item.product_uuid} className={styles.card}>
                                <Box className={styles.imageWrapper}>
                                    <CardMedia
                                        component="img"
                                        image={item.product?.image_url}
                                        alt={item.product?.name}
                                        className={styles.image}
                                    />
                                </Box>

                                <CardContent className={styles.cardContent}>
                                    <Typography className={styles.productName}>
                                        {item.product?.name}
                                    </Typography>

                                    <Typography className={styles.description}>
                                        {item.product?.description}
                                    </Typography>


                                    <Box className={styles.placeWrapper}>
                                        <Typography className={styles.quantity}>
                                            Quantity: {item.quantity}
                                        </Typography>

                                        <Typography className={styles.price}>
                                            Price: ₹ {(Number(price) * item.quantity)?.toFixed(2)}
                                        </Typography>

                                        <Typography className={styles.stock}>
                                            Stock: {Number(stock)}
                                        </Typography>
                                    </Box>

                                    <IconButton
                                        className={styles.removeBtn}
                                        onClick={() =>
                                            handleRemoveItem(item.product_uuid)
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardContent>

                                <Box className={styles.quantityWrapper}>
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            handleUpdateQuantity(item.product_uuid, item.quantity - 1)
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </Button>

                                    <Typography>{item.quantity}</Typography>

                                    <Button
                                        size="small"
                                        onClick={() =>
                                            handleUpdateQuantity(item.product_uuid, item.quantity + 1)
                                        }
                                        disabled={item.quantity >= Number(stock)}
                                    >
                                        +
                                    </Button>
                                </Box>
                            </Card>
                        );
                    })}
                </Box>
            )}

            <Box className={styles.summary}>
                <Typography className={styles.summaryText}>
                    Total Items: {cart?.items?.length || 0}
                </Typography>

                <Typography className={styles.summaryPrice}>
                    Total: ₹ {
                        cart?.items?.reduce((total, item) => {
                            const product = products.find((product) => product.uuid === item.product_uuid);
                            const saleProduct = saleProducts.find((product) => product.uuid === item.product_uuid);
                            return total + (Number(product?.price || item.product?.price || saleProduct?.price || 0) * item.quantity);
                        }, 0)?.toFixed(2)
                    }
                </Typography>
            </Box>

            <Box className={styles.paybox}>
                {cart && cart?.items?.length > 0 && (
                    <>
                        {user && (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setOpenUserAddressModal(true)}
                                >
                                    Place Order
                                </Button>
                            </>
                        )}
                        <Button
                            className={styles.clearcart}
                            onClick={handleClearCart}
                            variant="contained"
                        >
                            Clear Cart
                        </Button>
                    </>
                )}
                {user &&
                    <Button onClick={() => setOpenUserAddressModal(true)}>
                        Add address
                    </Button>
                }
            </Box>

            <UserAddressModal isOpen={openUserAddressModal} onClose={handleAddAddressClose} onSelectAddress={handlePlaceOrder} />
        </Container>
    );
}