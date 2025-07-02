import { z } from "zod";

export const addressSchema = z
  .object({
    no: z.string().min(1, "House number is required"),
    line1: z.string().min(1, "Address line 1 is required"),
    phoneNo: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
      .min(1, "Phone number is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    code: z.string().optional().or(z.literal("")),
    gps: z.string().optional().or(z.literal("")),
    useAsDelivery: z.boolean(),
    addressTypeId: z.string().uuid("Invalid address type ID"),
  })
  .strict();
export type AddressFormData = z.infer<typeof addressSchema>;
