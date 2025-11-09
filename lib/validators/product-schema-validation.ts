import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().min(1, "Description is required").trim(),
  productTypeId: z.string().uuid("Invalid product type ID"),
  durationId: z.string().uuid("Invalid duration ID"),
  images: z.array(z.string().url("Invalid image URL").min(1, "Image URL is required")).min(1, "At least one image is required"),
  currentMarketPricePerKg: z
    .number()
    .nonnegative("Market price must be non-negative"),
  farmerMonthlyPayment: z
    .number()
    .nonnegative("Farmer monthly payment must be non-negative"),
  roi: z.number().nonnegative("ROI must be non-negative"),
  estimatedHarvestQuantityPerPlot: z
    .number()
    .nonnegative("Estimated harvest quantity per plot must be non-negative"),
  daysToHarvestPerPlot: z
    .number()
    .int("Days to harvest per plot must be an integer")
    .nonnegative("Days to harvest per plot must be non-negative"),
  minimumNoOfFarmersPerPlot: z
    .number()
    .int("Minimum number of farmers per plot must be an integer")
    .min(1, "Minimum number of farmers per plot must be at least 1"),
});
