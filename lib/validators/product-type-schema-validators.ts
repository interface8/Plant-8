import { z } from "zod";

export const productTypeSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().min(1, "Description is required").trim(),
  prevId: z.string().uuid().optional().nullable(),
});
