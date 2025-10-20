import prisma from "@/db/prisma";
import { Product } from "@/types/product";

export async function getProduct(id: string): Promise<Product | null> {
  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    console.error(`Invalid UUID format: ${id}`);
    return null;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
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
        // Include recent investments so we can read a product-specific expectedReturn
        investments: {
          select: {
            id: true,
            expectedReturn: true,
            amount: true,
          },
          where: {
            status: { in: ["ACTIVE", "COMPLETED", "PENDING"] },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getProductStaticParams() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true },
    });
    return products.map((product) => ({
      id: `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${
        product.id
      }`,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
