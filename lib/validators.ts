import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Schema for API validation (excludes confirmPassword)
export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
export type SignUpApiData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signinSchema>;

export const investmentSchema = z.object({
  userId: z.string(),
  cropId: z.string().optional(),
  livestockId: z.string().optional(),
  amount: z.number().positive({ message: "Investment must be greater than 0" }),
  investmentType: z.enum(["SIX_MONTHS", "ONE_YEAR"]),
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED"]).optional(),
});

export const cropSchema = z.object({
  name: z.string().min(1, "Crop name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Image URL must be valid"),
});

export const livestockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Image URL must be valid"),
});

export const taskSchema = z.object({
  investmentId: z.string(),
  cropId: z.string().optional(),
  livestockId: z.string().optional(),
  name: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  imageUrl: z.string().url().optional(),
  completedAt: z.date().optional(),
});

export const carouselSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    imageUrl: z.string().url("Must be a valid URL"),
    link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    description: z.string().min(1, "Description is required"),
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Invalid start date")
      .transform((val) => new Date(val).toISOString()),
    endDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Invalid end date")
      .transform((val) => new Date(val).toISOString()),
    isActive: z.boolean(),
    type: z.enum(["homepage", "otherpage"]),
    sortOrder: z
      .number()
      .int("Must be an integer")
      .min(0, "Sort order must be non-negative"),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

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

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1500, "Message must not exceed 1500 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
