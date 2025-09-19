import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().min(1, "Description is required").trim(),
  productTypeId: z.string().uuid("Invalid product type ID"),
  durationId: z.string().uuid("Invalid duration ID"),
  imageUrl: z.string().url("Invalid image URL").min(1, "Image URL is required"),
  currentMarketPricePerKg: z
    .number()
    .nonnegative("Market price must be non-negative"),
  farmerMonthlyPayment: z
    .number()
    .nonnegative("Farmer monthly payment must be non-negative"),
});
