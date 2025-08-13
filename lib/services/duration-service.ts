import { Product } from "@/types/product";
import prisma from "@/db/prisma";

export async function getDurationAndProducts(name: string): Promise<{
  duration: { id: string; name: string; description: string } | null;
  products: Product[];
}> {
  try {
    const duration = await prisma.duration.findFirst({
      where: { name: { equals: name.replace("-", " "), mode: "insensitive" } },
      select: { id: true, name: true, description: true },
    });
    if (!duration) return { duration: null, products: [] };

    const products = await prisma.product.findMany({
      where: { durationId: duration.id },
      select: {
        id: true,
        name: true,
        description: true,
        productTypeId: true,
        durationId: true,
        imageUrl: true,
        currentMarketPricePerKg: true,
        farmerMonthlyPayment: true,
        ProductType: { select: { id: true, name: true } },
        duration: { select: { id: true, name: true } },
      },
    });

    return { duration, products };
  } catch (error) {
    console.error("Error fetching duration and products:", error);
    return { duration: null, products: [] };
  }
}

export async function getDurationStaticParams() {
  const durations = await prisma.duration.findMany({ select: { name: true } });
  return durations.map((duration) => ({
    name: duration.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}
