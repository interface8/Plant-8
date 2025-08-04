import { z } from "zod";

export const investmentSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  productId: z.string().uuid("Invalid product ID"),
  productTypeId: z.string().uuid("Invalid product type ID"),
  landId: z.string().uuid("Invalid land ID"),
  plotSize: z.enum(["HALF", "FULL"]).optional(),
  numberOfPlots: z
    .number()
    .int()
    .min(1, "Select at least 1 plot")
    .max(10, "Cannot select more than 10 plots"),
  numberOfTerms: z
    .number()
    .int()
    .min(1, "Select at least 1 term")
    .max(4, "Cannot select more than 4 terms"),
});

// export const investmentSchema = z.object({
//   userId: z.string().uuid("Invalid user ID"),
//   productId: z.string().uuid("Invalid product ID"),
//   productTypeId: z.string().uuid("Invalid product type ID"),
//   amount: z
//     .number()
//     .positive("Amount must be positive")
//     .min(100, "Minimum investment amount is ₦100"),
// });
