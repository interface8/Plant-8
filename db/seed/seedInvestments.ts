import prisma from "../prisma";
import crypto from "crypto";
interface ProductTypeResult {
  cropId: string;
  livestockId: string;
}

interface Product {
  id: string;
  name: string;
  productTypeId: string;
  durationId: string;
}

interface InvestmentCount {
  count: number;
}

export async function seedInvestments(
  adminId: string,
  productTypes: ProductTypeResult,
  products: Product[]
): Promise<InvestmentCount> {
  try {
    const cereals = await prisma.productType.findFirst({
      where: { name: "Cereals" },
    });
    const poultry = await prisma.productType.findFirst({
      where: { name: "Poultry" },
    });
    const maizeProduct = products.find((p) => p.name === "Maize Grain");
    const chickenProduct = products.find((p) => p.name === "Chicken Meat");
    const user = await prisma.user.findFirst({
      where: { email: "mojisola@mailinator.com" },
    });

    if (!cereals || !poultry || !maizeProduct || !chickenProduct || !user) {
      throw new Error("Required records for investments not found");
    }

    const investments = await prisma.investment.createMany({
      data: [
        {
          id: crypto.randomUUID(),
          userId: user.id,
          productId: maizeProduct.id,
          productTypeId: cereals.id,
          amount: 1000.0,
          expectedReturn: 1200.0,
          progress: 50,
          status: "ACTIVE",
          createdBy: adminId,
        },
        {
          id: crypto.randomUUID(),
          userId: user.id,
          productId: chickenProduct.id,
          productTypeId: poultry.id,
          amount: 5000.0,
          expectedReturn: 6250.0,
          progress: 30,
          status: "ACTIVE",
          createdBy: adminId,
        },
      ],
      skipDuplicates: true,
    });
    return investments;
  } catch (error) {
    console.error("Failed to seed investments:", error);
    throw error;
  }
}
