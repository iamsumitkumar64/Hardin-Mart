"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, Typography } from "@mui/material";
import styles from "./home.module.css";
import { RootState } from "@/redux/store";
import { getCatalogProducts, getSaleProducts, getShipmentProducts } from "@/redux/feature/product/product-action";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Product } from "@/redux/feature/product/product-type";
import { addToCart } from "@/redux/feature/cart/cart-slice";

export default function Home() {
  const dispatch = useAppDispatch();
  const { catalogProducts, saleProducts, ShipmentProducts, totalDocuments, loading } = useAppSelector((state: RootState) => state.productReducer);
  const { cart } = useAppSelector((state: RootState) => state.cartReducer);
  const { user } = useAppSelector((state: RootState) => state.authReducer);
  const [offset, setOffset] = useState(Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0);
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!catalogProducts?.length) {
      fetchInitialProducts();
    }
  }, []);

  const fetchInitialProducts = async () => {
    try {
      setOffset(0);

      await dispatch(getCatalogProducts({ limit, offset: 0 })).unwrap();
      await dispatch(getSaleProducts({ limit, offset: 0 })).unwrap();
      await dispatch(getShipmentProducts({ limit, offset: 0 })).unwrap();
    } catch (err: any) {
      console.log(err);
      enqueueSnackbar(err, { variant: "warning" });
    }
  };

  const fetchMoreProducts = async () => {
    try {
      if (loading) return;
      if (catalogProducts.length >= totalDocuments) return;

      const newOffset = offset + limit;
      setOffset(newOffset);

      const response = await dispatch(getCatalogProducts({ limit, offset: newOffset })).unwrap();
      await dispatch(getSaleProducts({ limit, offset: newOffset })).unwrap();
      await dispatch(getShipmentProducts({ limit, offset: newOffset })).unwrap();

      if (!response.data.length) {
        setHasMore(false);
        return;
      }

      if (catalogProducts.length + response.data.length >= totalDocuments) {
        setHasMore(false);
      }
    } catch (err: any) {
      console.log(err);
      enqueueSnackbar(err, { variant: "warning" });
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const alreadyInCart = cart?.items?.some((item) => item.product_uuid === product.uuid);
      if (alreadyInCart) {
        enqueueSnackbar("Already in cart", { variant: "warning" });
        return;
      }

      dispatch(
        addToCart({
          product_uuid: product.uuid,
          quantity: 1,
          product,
        })
      );

      enqueueSnackbar("Item added to cart", { variant: "success" });
    } catch (err: any) {
      console.log(err);
      enqueueSnackbar(err, { variant: "warning" });
    }
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.heading}>
          Product Listing
        </Typography>

        <Typography className={styles.subHeading}>
          Infinite Scroll Products
        </Typography>
      </Box>

      <Box id="scrollableDiv" className={styles.scrollWrapper}>
        <InfiniteScroll
          dataLength={catalogProducts?.length || saleProducts?.length || 0}
          next={fetchMoreProducts}
          hasMore={hasMore}
          loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
          endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
          scrollableTarget="scrollableDiv"
        >
          <Box className={styles.productWrapper}>
            {catalogProducts && catalogProducts.map((product: Product) => {
              const saleProduct = saleProducts ? saleProducts.find((item) => item.uuid === product.uuid) : null;
              const shipmentProduct = ShipmentProducts ? ShipmentProducts.find((item) => item.uuid === product.uuid) : null;
              const stock = shipmentProduct?.stock ?? 0;
              const alreadyInCart = cart?.items?.some((item) => item.product_uuid === product.uuid);

              return (
                <Card
                  key={product.uuid}
                  className={styles.card}
                  elevation={2}
                >
                  <Box className={styles.imageWrapper}>
                    <CardMedia
                      component="img"
                      image={product.image_url}
                      alt={product.name}
                      className={styles.image}
                    />
                  </Box>

                  <CardContent className={styles.cardContent}
                  >
                    <Typography className={styles.productName}>{product.name}</Typography>
                    <Typography className={styles.description}>{product.description}</Typography>

                    <Typography className={styles.price}>
                      Price: ${saleProduct?.price || 0}
                    </Typography>

                    <Typography className={styles.stock}>
                      Stock: {stock || 0}
                    </Typography>

                    <Button
                      className={styles.addtocart}
                      startIcon={<ShoppingCartIcon />}
                      disabled={alreadyInCart || stock <= 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      {cart?.items?.some((item) => item.product_uuid === product.uuid)
                        ? "Already in Cart"
                        : "Add to Cart"
                      }
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </InfiniteScroll>
      </Box>
    </Container>
  );
}