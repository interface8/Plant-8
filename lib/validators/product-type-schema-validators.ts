import { z } from "zod";

export const productTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  prevId: z.string().uuid().optional().nullable(),
});
