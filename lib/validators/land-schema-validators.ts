import { z } from "zod";

export const landSchema = z.object({
  name: z.string().min(1, "Land name is required"),
  gpsCoordinates: z.string().optional().nullable(),
  dailyPrice: z.number().min(0, "Daily price must be non-negative"),
  imageUrl: z.string().optional().nullable(),
  locationId: z.string().uuid("Invalid location ID"),
  fertilizerCostPerPlot: z.number().min(0, "Fertilizer cost per plot must be non-negative"),
  inspectionDailyFee: z.number().min(0, "Inspection daily fee must be non-negative"),
  inflationRate: z.number().min(0, "Inflation rate must be non-negative"),
});
