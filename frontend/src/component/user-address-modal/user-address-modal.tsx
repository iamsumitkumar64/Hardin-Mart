"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "@/redux/store";
import { addAddress, deleteAddress, getAddresses } from "@/redux/feature/address/address-action";
import { Address } from "@/redux/feature/address/address-type";
import { AddressFormData, addressSchema } from "@/schemas/address";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { Modal, Box, Typography, TextField, Checkbox, FormControlLabel, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, CircularProgress, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./user-address.module.css";
import DeleteIcon from '@mui/icons-material/Delete';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAddress: (uuid: string) => void;
}

export default function UserAddressModal({ isOpen, onClose, onSelectAddress }: AddressModalProps) {
    const dispatch = useAppDispatch();
    const { addresses, loading, error } = useAppSelector((state: RootState) => state.userAddressReducer);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            isDefault: false,
        },
    });

    useEffect(() => {
        if (isOpen) dispatch(getAddresses());
    }, [isOpen, dispatch]);

    const onSubmit = async (data: AddressFormData) => {
        await dispatch(addAddress(data));
        reset();
    };

    const handleDelete = async (uuid: string) => {
        await dispatch(deleteAddress({ uuid }));
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box className={styles.modalContainer}>
                <Box className={styles.leftContainer}>
                    <Box className={styles.header}>
                        <Typography variant="h6">
                            Add Address
                        </Typography>
                    </Box>

                    {error && (
                        <Box className={styles.errorBox}>
                            <Typography color="error">{error}</Typography>
                        </Box>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <TextField
                            label="Street"
                            {...register("street")}
                            error={!!errors.street}
                            helperText={errors.street?.message}
                            fullWidth
                        />
                        <TextField
                            label="City"
                            {...register("city")}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                            fullWidth
                        />
                        <TextField
                            label="State"
                            {...register("state")}
                            error={!!errors.state}
                            helperText={errors.state?.message}
                            fullWidth
                        />
                        <TextField
                            label="Postal Code"
                            {...register("postalCode")}
                            error={!!errors.postalCode}
                            helperText={errors.postalCode?.message}
                            fullWidth
                        />
                        <TextField
                            label="Country"
                            {...register("country")}
                            error={!!errors.country}
                            helperText={errors.country?.message}
                            fullWidth
                        />

                        <FormControlLabel
                            control={<Checkbox {...register("isDefault")} />}
                            label="Set as default"
                        />

                        <Button
                            type="submit"
                            color="primary"
                            fullWidth
                            disabled={loading}
                            startIcon={loading && <CircularProgress size={20} />}
                        >
                            Add Address
                        </Button>
                    </form>
                </Box>

                <Box className={styles.rightContainer}>
                    <Typography variant="h6">
                        Your Addresses
                    </Typography>

                    <List className={styles.addressList}>
                        {addresses?.map((addr: Address) => (
                            <ListItem key={addr.uuid} className={addr.isDefault ? styles.DefaultlistItem : styles.listItem}>
                                <ListItemText
                                    primary={`${addr.street}, ${addr.city}, ${addr.state}`}
                                    secondary={`${addr.postalCode}, ${addr.country} ${addr.isDefault ? "(Default)" : ""
                                        }`}
                                />

                                <ListItemSecondaryAction className={styles.actions}>
                                    <Button
                                        // className={styles.deleteAddress}
                                        onClick={() => {
                                            onSelectAddress(addr.uuid);
                                            onClose();
                                        }}
                                    >
                                        use in current cart
                                    </Button>
                                    <Button
                                        className={styles.deleteAddress}
                                        onClick={() => handleDelete(addr.uuid)}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </ListItemSecondaryAction>

                            </ListItem>
                        ))}
                    </List>
                </Box>

                <IconButton onClick={onClose} className={styles.closebtn}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </Modal>
    );
}