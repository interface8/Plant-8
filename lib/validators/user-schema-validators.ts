import { z } from "zod";

export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  phoneNo: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "+234" || /^\+\d{1,3}\d{7,15}$/.test(val),
      "Phone number must be in international format (e.g., +2341234567890)"
    ),
  password: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          val
        ),
      "Password must be at least 8 characters, with uppercase, lowercase, number, and special character"
    ),
});
export type UserFormData = z.infer<typeof userUpdateSchema>;
