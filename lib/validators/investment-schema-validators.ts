import { z } from "zod";

export const investmentSchema = z.object({
  userId: z.string(),
  cropId: z.string().optional(),
  livestockId: z.string().optional(),
  amount: z.number().positive({ message: "Investment must be greater than 0" }),
  investmentType: z.enum(["SIX_MONTHS", "ONE_YEAR"]),
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED"]).optional(),
});
