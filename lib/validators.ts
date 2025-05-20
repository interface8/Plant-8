import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

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

export const carouselSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().url("Image URL must be valid"),
  link: z.string().url().optional(),
});
