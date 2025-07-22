import prisma from "../prisma";
import crypto from "crypto";

interface AddressTypeCount {
  count: number;
}

export async function seedAddressTypes(): Promise<AddressTypeCount> {
  try {
    const addressTypes = await prisma.addressType.createMany({
      data: [
        {
          id: crypto.randomUUID(),
          name: "Home",
        },
        {
          id: crypto.randomUUID(),
          name: "Work",
        },
        {
          id: crypto.randomUUID(),
          name: "Other",
        },
      ],
      skipDuplicates: true,
    });
    return addressTypes;
  } catch (error) {
    console.error("Failed to seed address types:", error);
    throw error;
  }
}
