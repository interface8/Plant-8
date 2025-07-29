import { z } from "zod";

export const investmentSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  productId: z.string().uuid("Invalid product ID"),
  productTypeId: z.string().uuid("Invalid product type ID"),
  amount: z
    .number()
    .positive("Amount must be positive")
    .min(100, "Minimum investment amount is ₦100"),
});
