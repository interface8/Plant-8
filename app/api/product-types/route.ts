import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const productTypes = await prisma.productType.findMany({
      include: {
        children: true,
      },
    });
    res.status(200).json(productTypes);
  } catch (error) {
    console.error("Error fetching product types:", error);
    res.status(500).json({ error: "Failed to fetch product types" });
  }
}
