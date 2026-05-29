"use client"

import { useRouter } from "next/navigation"
import { Box, Button } from "@mui/material"
import { RootState } from "@/redux/store"
import styles from "./header-comp.module.css"
import { logoutUser } from "@/redux/feature/auth/auth-action"
import { enqueueSnackbar } from "notistack"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"

export default function HeaderComp() {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state: RootState) => state.authReducer);

    const handleLogOut = async () => {
        try {
            await dispatch(logoutUser()).unwrap()
            localStorage.clear()
            router.replace("/")
        } catch (err: any) {
            enqueueSnackbar(err, { variant: "error", })
        }
    }

    return (
        <header className={styles.header}>
            <Box className={styles.leftContainer}>
                {/* <p onClick={() => {
                    router.push("/")
                }}>Ecommerce Microservice</p> */}
                <Box className={styles.logoContainer}
                    onClick={() => {
                        router.push("/")
                    }}
                >
                    <Box className={styles.logoIcon}>
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            // strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </Box>

                    <span className={styles.logoText}>Hardin Mart</span>
                </Box>
            </Box>

            <Box className={styles.rightContainer}>
                <Button
                    onClick={() => {
                        router.push("/")
                    }}
                >
                    Home
                </Button>

                <Button
                    onClick={() => {
                        router.push("/cart")
                    }}
                >
                    Cart
                </Button>

                {user ? (
                    <>
                        <Button
                            onClick={() => {
                                router.push("/order")
                            }}
                        >
                            Order
                        </Button>

                        <Button
                            onClick={() => {
                                router.push("/wallet")
                            }}
                        >
                            Wallet
                        </Button>

                        <Button
                            className={styles.logoutbtn}
                            onClick={async () => { await handleLogOut() }}
                        >
                            Log Out
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={() => {
                            router.push("/login")
                        }}
                    >
                        Sign In
                    </Button>
                )}
            </Box>
        </header >
    )
}