/* eslint-disable @typescript-eslint/no-explicit-any */
import InvestmentCatalog from "@/components/investment/investment-catalog";
import prisma from "@/db/prisma";

export const revalidate = 60;
export default async function InvestmentCatalogPage() {
  // Fetch all product types (crop categories)
  const productTypes = await prisma.productType.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: { name: "asc" },
  });

  // Fetch all durations
  const durations = await prisma.duration.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: { name: "asc" },
  });

  // Fetch all products with their investments data
  const productsRaw = await prisma.product.findMany({
    include: {
      ProductType: {
        select: {
          id: true,
          name: true,
        },
      },
      duration: {
        select: {
          id: true,
          name: true,
        },
      },
      investments: {
        select: {
          id: true,
          amount: true,
          status: true,
          expectedReturn: true,
          land: {
            select: {
              location: {
                select: {
                  name: true,
                  state: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          status: {
            in: ["ACTIVE", "COMPLETED", "PENDING"],
          },
        },
      },
        images: {
          select: { url: true },
        },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  

  // Map to Product[]
  const products = productsRaw.map((product: any) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    productTypeId: product.productTypeId,
    durationId: product.durationId,
    images: Array.isArray(product.images) ? product.images.map((img: any) => img.url) : [],
    currentMarketPricePerKg: product.currentMarketPricePerKg,
    farmerMonthlyPayment: product.farmerMonthlyPayment,
    roi: product.roi,
    ProductType: product.ProductType,
    duration: product.duration,
    investments: product.investments,
  }));

  // Calculate statistics
  const totalInvestments = products.reduce(
    (sum, product) => sum + (product.investments?.length || 0),
    0
  );

  const avgReturn = products.reduce((sum, product) => {
    const productAvg = product.investments && product.investments.length > 0
      ? product.investments.reduce((s: number, inv: any) => s + (inv.expectedReturn || 0), 0) / product.investments.length
      : 0;
    return sum + productAvg;
  }, 0) / (products.length || 1);

  return (
    <InvestmentCatalog
      productTypes={productTypes}
      durations={durations}
      products={products}
      stats={{
        avgReturn,
        insuredPercentage: 100,
        totalOptions: products.length,
        totalInvestments,
      }}
    />
  );
}
