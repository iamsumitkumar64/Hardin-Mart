import { z } from "zod";

export const addAmountSchema = z.object({
    amount: z.coerce.number<number>()
        .min(1, "Amount must be greater than 0"),
});
export type AddAmountSchemaType = z.infer<typeof addAmountSchema>;