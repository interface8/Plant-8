import { Product } from "@/types/product";
import prisma from "@/db/prisma";

export async function getCategoryAndProducts(name: string): Promise<{
  category: { id: string; name: string; description: string } | null;
  products: Product[];
}> {
  try {
    const category = await prisma.productType.findFirst({
      where: { name: { equals: name.replace("-", " "), mode: "insensitive" } },
      select: { id: true, name: true, description: true },
    });
    if (!category) return { category: null, products: [] };

    const products = await prisma.product.findMany({
      where: { productTypeId: category.id },
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
    // Map images to string[] for each product
    const productsWithImages = products.map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images.map((img) => img.url) : [],
      estimatedHarvestQuantityPerPlot: p.estimatedHarvestQuantityPerPlot,
      daysToHarvestPerPlot: p.daysToHarvestPerPlot,
      minimumNoOfFarmersPerPlot: p.minimumNoOfFarmersPerPlot,
    }));

    return { category, products: productsWithImages };
  } catch (error) {
    console.error("Error fetching category and products:", error);
    return { category: null, products: [] };
  }
}

export async function getCategoryStaticParams() {
  const categories = await prisma.productType.findMany({
    select: { name: true },
  });
  return categories.map((category) => ({
    name: category.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}
