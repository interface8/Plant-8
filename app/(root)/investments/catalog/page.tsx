import InvestmentCatalog from "@/components/investment/investment-catalog";
import prisma from "@/db/prisma";

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
  const products = await prisma.product.findMany({
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
      _count: {
        select: {
          investments: true,
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate statistics
  const totalInvestments = products.reduce(
    (sum, product) => sum + product._count.investments,
    0
  );
  
  const avgReturn = products.reduce((sum, product) => {
    const productAvg = product.investments.length > 0
      ? product.investments.reduce((s, inv) => s + (inv.expectedReturn || 0), 0) / product.investments.length
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
