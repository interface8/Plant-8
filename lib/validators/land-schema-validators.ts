import { z } from "zod";

export const landSchema = z.object({
  name: z.string().min(1, "Land name is required"),
  gpsCoordinates: z.string().optional().nullable(),
  halfPlotPrice: z.number().min(0, "Half plot price must be non-negative"),
  fullPlotPrice: z.number().min(0, "Full plot price must be non-negative"),
  imageUrl: z.string().optional().nullable(),
  locationId: z.string().uuid("Invalid location ID"),
});
