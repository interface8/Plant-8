import { z } from "zod";

export const investmentSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  productId: z.string().uuid("Invalid product ID"),
  productTypeId: z.string().uuid("Invalid product type ID"),
  amount: z.number().positive("Amount must be positive"),
  expectedReturn: z
    .number()
    .nonnegative("Expected return must be non-negative")
    .optional(),
  progress: z
    .number()
    .int()
    .nonnegative("Progress must be a non-negative integer")
    .optional(),
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "FAILED"]).optional(),
});
