import { z } from "zod";

export const userUpdateSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    phoneNo: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
      .max(20, "Phone number is too long")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional()
      .or(z.literal("")),
  })
  .strict();

export type UserFormData = z.infer<typeof userUpdateSchema>;
