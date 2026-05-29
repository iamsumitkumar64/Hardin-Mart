"use client"

import styles from "./auth.module.css";
import { Box } from "@mui/material";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box className={styles.layout}>
            {children}
        </Box>
    );
}
