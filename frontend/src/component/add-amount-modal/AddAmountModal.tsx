"use client";

import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/redux/hooks.ts";
import { addAmountSchema, AddAmountSchemaType } from "@/schemas/payment";
import { addAmount, getWallet, getwalletHistories } from "@/redux/feature/wallet/wallet.action";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function AddAmountModal({ open, onClose }: Props) {
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<AddAmountSchemaType>({
        resolver: zodResolver(addAmountSchema),
    });

    const onSubmit = async (data: AddAmountSchemaType) => {
        try {
            await dispatch(addAmount(data)).unwrap();
            enqueueSnackbar("Amount Added", { variant: "success" });
            reset();
            onClose();
            await dispatch(getWallet()).unwrap();
            await dispatch(getwalletHistories()).unwrap();
        } catch (error: any) {
            enqueueSnackbar(String(error), { variant: "error" });
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ width: 400, bgcolor: "white", p: 4, mx: "auto", mt: 35, borderRadius: 2 }}>
                <Typography variant="h6">Add Amount</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        margin="normal"
                        {...register("amount")}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                    />
                    <Button type="submit" fullWidth sx={{ mt: 2 }}>Add Amount</Button>
                </form>
            </Box>
        </Modal>
    );
}