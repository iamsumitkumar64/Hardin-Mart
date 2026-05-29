import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string()
        .min(3, 'Password must be at least 3 characters')
    // .max(32, 'Password must be at most 32 characters')
    // // Regex: 1 upper, 1 lower, 1 digit, 1 special char
    // .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //     'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
    // ),
})

export type LoginSchemaType = z.infer<typeof loginSchema>   