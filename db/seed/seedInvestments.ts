// import prisma from "../prisma";
// import crypto from "crypto";
// interface ProductTypeResult {
//   cropId: string;
//   livestockId: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   productTypeId: string;
//   durationId: string;
// }

// interface InvestmentCount {
//   count: number;
// }

// export async function seedInvestments(
//   adminId: string,
//   productTypes: ProductTypeResult,
//   products: Product[]
// ): Promise<InvestmentCount> {
//   try {
//     const cereals = await prisma.productType.findFirst({
//       where: { name: "Cereals" },
//     });
//     const poultry = await prisma.productType.findFirst({
//       where: { name: "Poultry" },
//     });
//     const maizeProduct = products.find((p) => p.name === "Maize Grain");
//     const chickenProduct = products.find((p) => p.name === "Chicken Meat");
//     const user = await prisma.user.findFirst({
//       where: { email: "mojisola@mailinator.com" },
//     });

//     if (!cereals || !poultry || !maizeProduct || !chickenProduct || !user) {
//       throw new Error("Required records for investments not found");
//     }

//     const investments = await prisma.investment.createMany({
//       data: [
//         {
//           id: crypto.randomUUID(),
//           userId: user.id,
//           productId: maizeProduct.id,
//           productTypeId: cereals.id,
//           landId: null,
//           plotSize: "1 acre",
//           numberOfPlots: 2,
//           numberOfTerms: 1,
//           numberOfFarmers: 3,
//           amount: 1000.0,
//           expectedReturn: 1200.0,
//           progress: 50,
//           status: "ACTIVE",
//           totalCost: 800.0,
//           estimatedRevenue: 1300.0,
//           adjustedRevenue: 1250.0,
//           netReturn: 400.0,
//           roiPercent: 20.0,
//           roiPerDay: 0.5,
//           adjustedYield: 1.2,
//           effectiveDaysToHarvest: 90,
//           estimatedHarvestQuantity: 500.0,
//           createdBy: adminId,
//         },
//         {
//           id: crypto.randomUUID(),
//           userId: user.id,
//           productId: chickenProduct.id,
//           productTypeId: poultry.id,
//           landId: null,
//           plotSize: "2 acres",
//           numberOfPlots: 1,
//           numberOfTerms: 2,
//           numberOfFarmers: 2,
//           amount: 5000.0,
//           expectedReturn: 6250.0,
//           progress: 30,
//           status: "ACTIVE",
//           totalCost: 4000.0,
//           estimatedRevenue: 7000.0,
//           adjustedRevenue: 6800.0,
//           netReturn: 2250.0,
//           roiPercent: 25.0,
//           roiPerDay: 0.7,
//           adjustedYield: 1.5,
//           effectiveDaysToHarvest: 120,
//           estimatedHarvestQuantity: 800.0,
//           createdBy: adminId,
//         },
//       ],
//       skipDuplicates: true,
//     });
//     return investments;
//   } catch (error) {
//     console.error("Failed to seed investments:", error);
//     throw error;
//   }
// }
