import "dotenv/config";
import prisma from "./prisma";
import crypto from "crypto";

const themeColors = {
  cocoa: {
    primary: "#6B4423",
    secondary: "#8B5A3C", 
    accent: "#A0522D",
    gradient: "from-amber-900 to-yellow-800"
  },
  maize: {
    primary: "#FFD700",
    secondary: "#228B22",
    accent: "#FFA500", 
    gradient: "from-yellow-400 to-green-600"
  },
  cassava: {
    primary: "#DEB887",
    secondary: "#8B4513",
    accent: "#F5DEB3",
    gradient: "from-yellow-200 to-amber-700"
  },
  tomato: {
    primary: "#DC143C",
    secondary: "#228B22",
    accent: "#FF6347",
    gradient: "from-red-500 to-green-600"
  },
  orange: {
    primary: "#FF8C00",
    secondary: "#32CD32",
    accent: "#FFA500",
    gradient: "from-orange-400 to-green-500"
  },
  cattle: {
    primary: "#FFFFFF",
    secondary: "#000000",
    accent: "#8B4513",
    gradient: "from-gray-100 to-gray-300"
  },
  chicken: {
    primary: "#FFD700",
    secondary: "#FF6347",
    accent: "#FFA500",
    gradient: "from-yellow-300 to-orange-400"
  },
  rice: {
    primary: "#F5DEB3",
    secondary: "#228B22",
    accent: "#DAA520",
    gradient: "from-amber-100 to-green-600"
  },
  pepper: {
    primary: "#DC143C",
    secondary: "#32CD32",
    accent: "#FF4500",
    gradient: "from-red-600 to-green-500"
  }
};

async function main() {
  try {
    console.log("Starting seed...");

    // Create admin user
    const adminId = "581b8e3d-8958-4133-8ce9-d0db66a37af4";

    // Seed Durations
    const sixMonthsDuration = await prisma.duration.upsert({
      where: { name: "6 months" },
      update: {},
      create: {
        id: crypto.randomUUID(),
        name: "6 months",
        months: 6,
        description: "Mid-term investment cycle",
        createdBy: adminId,
      },
    });

    const oneYearDuration = await prisma.duration.upsert({
      where: { name: "12 months" },
      update: {},
      create: {
        id: crypto.randomUUID(),
        name: "12 months",
        months: 12,
        description: "Long-term investment cycle",
        createdBy: adminId,
      },
    });

    console.log("✅ Seeded durations");

    // Seed Product Types (Categories)
    const cropType = await prisma.productType.upsert({
      where: { name: "Crop" },
      update: {},
      create: {
        id: crypto.randomUUID(),
        name: "Crop",
        description: "Agricultural crop investments",
        createdBy: adminId,
      },
    });

    const livestockType = await prisma.productType.upsert({
      where: { name: "Livestock" },
      update: {},
      create: {
        id: crypto.randomUUID(),
        name: "Livestock",
        description: "Livestock farming investments",
        createdBy: adminId,
      },
    });

    console.log("✅ Seeded product types");

    // Seed Products with Theme Colors
    const products = [
      {
        name: "Cocoa",
        description: "Premium cocoa beans cultivation. High-quality cocoa for chocolate production with excellent market demand.",
        productTypeId: cropType.id,
        durationId: oneYearDuration.id,
        currentMarketPricePerKg: 850,
        farmerMonthlyPayment: 15000,
        roi: 25,
        estimatedHarvestQuantityPerPlot: 500,
        daysToHarvestPerPlot: 365,
        minimumNoOfFarmersPerPlot: 2,
        dailyMaintenanceFee: 150,
        cssThemeProperty: themeColors.cocoa,
      },
      {
        name: "Maize",
        description: "Yellow maize farming. Fast-growing staple crop with consistent market demand and multiple uses.",
        productTypeId: cropType.id,
        durationId: sixMonthsDuration.id,
        currentMarketPricePerKg: 320,
        farmerMonthlyPayment: 10000,
        roi: 20,
        estimatedHarvestQuantityPerPlot: 800,
        daysToHarvestPerPlot: 180,
        minimumNoOfFarmersPerPlot: 1,
        dailyMaintenanceFee: 100,
        cssThemeProperty: themeColors.maize,
      },
      {
        name: "Cassava",
        description: "High-yield cassava cultivation. Versatile root crop for food processing and industrial use.",
        productTypeId: cropType.id,
        durationId: oneYearDuration.id,
        currentMarketPricePerKg: 180,
        farmerMonthlyPayment: 12000,
        roi: 22,
        estimatedHarvestQuantityPerPlot: 1200,
        daysToHarvestPerPlot: 365,
        minimumNoOfFarmersPerPlot: 1,
        dailyMaintenanceFee: 120,
        cssThemeProperty: themeColors.cassava,
      },
      {
        name: "Tomato",
        description: "Fresh tomato farming. High-demand vegetable crop with year-round market opportunities.",
        productTypeId: cropType.id,
        durationId: sixMonthsDuration.id,
        currentMarketPricePerKg: 450,
        farmerMonthlyPayment: 8000,
        roi: 28,
        estimatedHarvestQuantityPerPlot: 600,
        daysToHarvestPerPlot: 180,
        minimumNoOfFarmersPerPlot: 1,
        dailyMaintenanceFee: 90,
        cssThemeProperty: themeColors.tomato,
      },
      {
        name: "Orange",
        description: "Citrus orange cultivation. Premium fruit with excellent nutritional value and export potential.",
        productTypeId: cropType.id,
        durationId: oneYearDuration.id,
        currentMarketPricePerKg: 380,
        farmerMonthlyPayment: 13000,
        roi: 24,
        estimatedHarvestQuantityPerPlot: 700,
        daysToHarvestPerPlot: 365,
        minimumNoOfFarmersPerPlot: 2,
        dailyMaintenanceFee: 130,
        cssThemeProperty: themeColors.orange,
      },
      {
        name: "Rice",
        description: "Premium rice farming. Staple food crop with consistent demand and government support.",
        productTypeId: cropType.id,
        durationId: sixMonthsDuration.id,
        currentMarketPricePerKg: 420,
        farmerMonthlyPayment: 11000,
        roi: 21,
        estimatedHarvestQuantityPerPlot: 900,
        daysToHarvestPerPlot: 180,
        minimumNoOfFarmersPerPlot: 1,
        dailyMaintenanceFee: 110,
        cssThemeProperty: themeColors.rice,
      },
      {
        name: "Pepper",
        description: "Hot pepper cultivation. High-value spice crop with strong local and export markets.",
        productTypeId: cropType.id,
        durationId: sixMonthsDuration.id,
        currentMarketPricePerKg: 550,
        farmerMonthlyPayment: 9000,
        roi: 30,
        estimatedHarvestQuantityPerPlot: 500,
        daysToHarvestPerPlot: 180,
        minimumNoOfFarmersPerPlot: 1,
        dailyMaintenanceFee: 95,
        cssThemeProperty: themeColors.pepper,
      },
      {
        name: "Cattle",
        description: "Beef cattle rearing. Premium livestock investment with high returns and meat market demand.",
        productTypeId: livestockType.id,
        durationId: oneYearDuration.id,
        currentMarketPricePerKg: 2500,
        farmerMonthlyPayment: 20000,
        roi: 35,
        estimatedHarvestQuantityPerPlot: 400,
        daysToHarvestPerPlot: 365,
        minimumNoOfFarmersPerPlot: 3,
        dailyMaintenanceFee: 200,
        cssThemeProperty: themeColors.cattle,
      },
      {
        name: "Chicken (Broiler)",
        description: "Fast-growing broiler chickens. Quick returns with high market demand for poultry meat.",
        productTypeId: livestockType.id,
        durationId: sixMonthsDuration.id,
        currentMarketPricePerKg: 1200,
        farmerMonthlyPayment: 8000,
        roi: 26,
        estimatedHarvestQuantityPerPlot: 300,
        daysToHarvestPerPlot: 180,
        minimumNoOfFarmersPerPlot: 1,
        dailyMaintenanceFee: 85,
        cssThemeProperty: themeColors.chicken,
      },
    ];

    for (const product of products) {
      const created = await prisma.product.upsert({
        where: { name: product.name },
        update: {
          cssThemeProperty: product.cssThemeProperty,
        },
        create: {
          id: crypto.randomUUID(),
          ...product,
          createdBy: adminId,
        },
      });
      console.log(`✅ Created product: ${created.name}`);
    }

    console.log("✅ Seeded products with theme colors");

    // Seed sample blogs with theme colors
    const cocoaProduct = await prisma.product.findUnique({ where: { name: "Cocoa" } });
    const maizeProduct = await prisma.product.findUnique({ where: { name: "Maize" } });
    const cattleProduct = await prisma.product.findUnique({ where: { name: "Cattle" } });

    if (cocoaProduct && maizeProduct && cattleProduct) {
      await prisma.blog.upsert({
        where: { slug: "cocoa-farming-guide" },
        update: {},
        create: {
          id: crypto.randomUUID(),
          title: "Complete Guide to Cocoa Farming in Nigeria",
          slug: "cocoa-farming-guide",
          content: "Cocoa farming is one of the most profitable agricultural ventures...",
          excerpt: "Learn everything about cocoa cultivation, from planting to harvesting and processing.",
          category: "Farming Guide",
          tags: ["cocoa", "farming", "guide"],
          status: "PUBLISHED",
          readTime: 8,
          publishedAt: new Date(),
          productId: cocoaProduct.id,
          productTypeId: cocoaProduct.productTypeId,
          cssThemeProperty: themeColors.cocoa,
          createdBy: adminId,
        },
      });

      await prisma.blog.upsert({
        where: { slug: "maize-investment-tips" },
        update: {},
        create: {
          id: crypto.randomUUID(),
          title: "Why Maize Investment is Booming in 2025",
          slug: "maize-investment-tips",
          content: "Maize continues to be a staple investment choice...",
          excerpt: "Discover why maize farming offers excellent returns and how to maximize your investment.",
          category: "Investment Tips",
          tags: ["maize", "investment", "profit"],
          status: "PUBLISHED",
          readTime: 6,
          publishedAt: new Date(),
          productId: maizeProduct.id,
          productTypeId: maizeProduct.productTypeId,
          cssThemeProperty: themeColors.maize,
          createdBy: adminId,
        },
      });

      await prisma.blog.upsert({
        where: { slug: "cattle-farming-success" },
        update: {},
        create: {
          id: crypto.randomUUID(),
          title: "Building Wealth Through Cattle Farming",
          slug: "cattle-farming-success",
          content: "Cattle farming remains one of the most lucrative livestock investments...",
          excerpt: "Success stories and strategies for profitable cattle farming operations.",
          category: "Market Insights",
          tags: ["cattle", "livestock", "success"],
          status: "PUBLISHED",
          readTime: 10,
          publishedAt: new Date(),
          productId: cattleProduct.id,
          productTypeId: cattleProduct.productTypeId,
          cssThemeProperty: themeColors.cattle,
          createdBy: adminId,
        },
      });

      console.log("✅ Seeded blogs with theme colors");
    }

    console.log("\n🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
