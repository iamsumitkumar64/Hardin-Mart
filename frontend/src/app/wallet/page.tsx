"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import { RootState, AppDispatch } from "@/redux/store";
import styles from "./wallet.module.css"
import { getWallet, getwalletHistories } from "@/redux/feature/wallet/wallet-action";
import { WalletHistoryTypeEnum } from "@/enum/wallet.enum";
import AddAmountModal from "@/component/add-amount-modal/add-amount-modal";

export default function PaymentHistoryPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { wallet, status, histories, loading, error } = useSelector((state: RootState) => state.walletReducer);
    const [openCardModal, setOpenCardModal] = useState(false);
    const [openAmountModal, setOpenAmountModal] = useState(false);

    useEffect(() => {
        dispatch(getWallet());
        dispatch(getwalletHistories());
    }, [dispatch]);

    return (
        <Container maxWidth="xl" className={styles.container}>
            <Box className={styles.header}>
                <Typography variant="h4" className={styles.heading}>
                    Payment Account
                </Typography>

                <Typography className={styles.subHeading}>
                    Check Current Balance
                </Typography>
            </Box>

            {/* {loading && (
                <Box display="flex" justifyContent="center" marginTop="5%">
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Typography color="error" style={{ marginBottom: "2%" }}>
                    {error}
                </Typography>
            )} */}

            {/* {!loading && account && ( */}
            {wallet && (
                <Card className={styles.accountCard}>
                    <CardContent>
                        <Typography variant="h6">Account Balance</Typography>
                        <Typography variant="body1">₹ {wallet.balance?.toFixed(2)}</Typography>
                    </CardContent>

                    <Box className={styles.buttonsContainer}>
                        <Button onClick={() => setOpenAmountModal(true)}>
                            Add Amount
                        </Button>
                    </Box>
                </Card>
            )}

            {/* {!loading && histories.length === 0 && (
                <Typography>No payment history yet.</Typography>
            )} */}

            <Box className={styles.header}>
                <Typography variant="h4" className={styles.heading}>
                    Payment History
                </Typography>

                <Typography className={styles.subHeading}>
                    Check Payment Histories
                </Typography>
            </Box>
            <Box className={styles.historyList}>
                {histories.map((item, idx) => {
                    const descendingIndex = histories.length - 1 - idx;

                    return (
                        <Card key={item.uuid} className={styles.historyCard}>
                            <Box
                                className={`${styles.historyLabel} ${item.type === WalletHistoryTypeEnum.TOPUP
                                    ? styles.topup
                                    : item.type === WalletHistoryTypeEnum.REFUND
                                        ? styles.refund
                                        : styles.payment
                                    }`}
                            >
                                {item.type?.toUpperCase()}
                            </Box>

                            <CardContent>
                                <Typography variant="subtitle1" className={styles.HistoryIndex}>#{descendingIndex + 1}</Typography>
                                {/* <Typography variant="subtitle2">Type: {item.type?.toUpperCase()}</Typography> */}
                                <Typography>Amount: ₹ {Number(item.amount).toFixed(2)}</Typography>
                                <Typography>{item.description || "No description"}</Typography>
                                <Typography color="textSecondary">
                                    {new Date(item.created_at).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            <AddAmountModal open={openAmountModal} onClose={() => setOpenAmountModal(false)} />
        </Container>
    );
}