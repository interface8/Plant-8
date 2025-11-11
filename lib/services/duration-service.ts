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
        images: { select: { url: true } },
        currentMarketPricePerKg: true,
        farmerMonthlyPayment: true,
        roi: true,
        estimatedHarvestQuantityPerPlot: true,
        daysToHarvestPerPlot: true,
        minimumNoOfFarmersPerPlot: true,
        dailyMaintenanceFee: true,
        ProductType: { select: { id: true, name: true } },
        duration: { select: { id: true, name: true } },
      },
    });
    const productsWithImages = products.map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images.map((img) => img.url) : [],
      estimatedHarvestQuantityPerPlot: p.estimatedHarvestQuantityPerPlot,
      daysToHarvestPerPlot: p.daysToHarvestPerPlot,
      minimumNoOfFarmersPerPlot: p.minimumNoOfFarmersPerPlot,
    }));
    return { duration, products: productsWithImages };
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
