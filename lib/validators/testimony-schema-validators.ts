import { z } from "zod";

export const testimonySchema = z.object({
  investorName: z.string().min(1, "Name is required"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  location: z.string().min(1, "Location is required"),
  isApproved: z.boolean(),
  createdById: z.string().uuid("Invalid user ID").optional(),
  modifiedById: z.string().uuid("Invalid user ID").optional(),
});
