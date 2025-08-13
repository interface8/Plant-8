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
        imageUrl: true,
        currentMarketPricePerKg: true,
        farmerMonthlyPayment: true,
        ProductType: { select: { id: true, name: true } },
        duration: { select: { id: true, name: true } },
      },
    });

    return { category, products };
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
