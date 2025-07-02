import { z } from "zod";

export const cropSchema = z.object({
  name: z.string().min(1, "Crop name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Image URL must be valid"),
});
