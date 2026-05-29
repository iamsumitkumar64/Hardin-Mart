import { z } from "zod"

export const signupSchema = z
    .object({
        name: z.string().min(1, "User name is required"),
        email: z.string().min(1, "Email is required").email("Invalid email"),
        password: z.string()
            .min(3, 'Password must be at least 3 characters'),
        // .max(32, 'Password must be at most 32 characters')
        // // Regex: 1 upper, 1 lower, 1 digit, 1 special char
        // .regex(
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        //     'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
        // ),
        confirmPassword: z.string().min(3, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })

export type SignupSchemaType = z.infer<typeof signupSchema>