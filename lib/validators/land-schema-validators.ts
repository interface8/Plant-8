import { z } from "zod";

export const landSchema = z.object({
  name: z.string().min(1, "Land name is required"),
  gpsCoordinates: z.string().optional().nullable(),
  halfPlotPrice: z.number().min(0, "Half plot price must be non-negative"),
  fullPlotPrice: z.number().min(0, "Full plot price must be non-negative"),
  imageUrl: z.string().optional().nullable(),
  locationId: z.string().uuid("Invalid location ID"),
  farmerDailyWage: z.number().min(0, "Farmer daily wage must be non-negative"),
  fertilizerCostPerPlot: z.number().min(0, "Fertilizer cost per plot must be non-negative"),
  inspectionDailyFee: z.number().min(0, "Inspection daily fee must be non-negative"),
  inflationRate: z.number().min(0, "Inflation rate must be non-negative"),
});
