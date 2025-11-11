import prisma from "../prisma";
import crypto from "crypto";

interface DurationCount {
  count: number;
}

export async function seedDurations(adminId: string): Promise<DurationCount> {
  try {
    const durations = await prisma.duration.createMany({
      data: [
        {
          id: crypto.randomUUID(),
          name: "3 months",
          description: "Short-term investment",
          createdBy: adminId,
        },
        {
          id: crypto.randomUUID(),
          name: "6 months",
          description: "Mid-term investment",
          createdBy: adminId,
        },
          {
          id: crypto.randomUUID(),
          name: "9 months",
          description: "Long-term investment",
          createdBy: adminId,
        },
        {
          id: crypto.randomUUID(),
          name: "12 months",
          description: "Long-term investment",
          createdBy: adminId,
        },
      ],
      skipDuplicates: true,
    });
      return { count: durations.count }; // Adjusted to return the count of created durations
  } catch (error) {
    console.error("Failed to seed durations:", error);
    throw error;
  }
}
