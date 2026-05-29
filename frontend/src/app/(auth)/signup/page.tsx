"use client"

import styles from "./signup.module.css"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, SignupSchemaType } from "@/schemas/signup"
import { signupUser } from "@/redux/feature/auth/auth-action"
import { useRouter } from "next/navigation"

import {
    Box,
    Button,
    Card,
    MenuItem,
    TextField,
    Typography
} from "@mui/material"
import { enqueueSnackbar } from "notistack"
import Image from "next/image"

export default function SignupForm() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema),
    })

    const onSubmit = async (data: SignupSchemaType) => {
        try {
            await dispatch(signupUser(data)).unwrap()
            enqueueSnackbar("User Registered Success", { variant: "success" });
            router.replace("/login")
        } catch (error) {
            enqueueSnackbar(String(error || "Something wrong"), { variant: "error" });
            console.error(error)
        }
    }

    return (
        <Box className={styles.container}>
            <Card className={styles.formWrapper} elevation={3}>
                <Typography variant="h5" className={styles.title}>
                    Join Us! It's free
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Box className={styles.field}>
                        <TextField
                            label="Name"
                            type="text"
                            fullWidth
                            {...register("name")}
                        />
                        {errors.name && (
                            <span className={styles.error}>
                                {errors.name.message}
                            </span>
                        )}
                    </Box>

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        {...register("email")}
                    />
                    {errors.email && (
                        <span className={styles.error}>
                            {errors.email.message}
                        </span>
                    )}

                    <Box className={styles.field}>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            {...register("password")}
                        />
                        {errors.password && (
                            <span className={styles.error}>
                                {errors.password.message}
                            </span>
                        )}
                    </Box>

                    <Box className={styles.field}>
                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <span className={styles.error}>
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        className={styles.button}
                    >
                        Signup
                    </Button>

                    <Button
                        className={styles.loginBtn}
                        onClick={() => router.replace("/login")}
                    >
                        Already have an account?
                    </Button>
                </form>
            </Card>
            <Image src={"/signup-logo-page.svg"} alt="Signup side page missing" width={500} height={500} />
        </Box >
    )
}