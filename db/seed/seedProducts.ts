import prisma from "../prisma";
import crypto from "crypto";

interface Product {
  id: string;
  name: string;
  productTypeId: string;
  durationId: string;
  roi: number | null;
  currentMarketPricePerKg: number;
  description: string;
  images: string[];
  estimatedHarvestQuantityPerPlot: number;
  daysToHarvestPerPlot: number;
  minimumNoOfFarmersPerPlot: number;
  dailyMaintenanceFee: number;
}

export async function seedProducts(adminId: string): Promise<Product[]> {
  try {
    const cereals = await prisma.productType.findFirst({
      where: { name: "Cereals" },
    });
    const tubers = await prisma.productType.findFirst({
      where: { name: "Tubers" },
    });
    const vegetables = await prisma.productType.findFirst({
      where: { name: "Vegetables" },
    });
    const legumes = await prisma.productType.findFirst({
      where: { name: "Legumes" },
    });
    const fruits = await prisma.productType.findFirst({
      where: { name: "Fruits" },
    });
    const spices = await prisma.productType.findFirst({
      where: { name: "Spice Crops" },
    });
    const poultry = await prisma.productType.findFirst({
      where: { name: "Poultry" },
    });
    const ruminants = await prisma.productType.findFirst({
      where: { name: "Ruminants" },
    });

    // Fetch durations
    const threeMonths = await prisma.duration.findFirst({
      where: { name: "3 months" },
    });
    const sixMonths = await prisma.duration.findFirst({
      where: { name: "6 months" },
    });
    const twelveMonths = await prisma.duration.findFirst({
      where: { name: "12 months" },
    });

    if (
      !cereals ||
      !tubers ||
      !vegetables ||
      !legumes ||
      !fruits ||
      !spices ||
      !poultry ||
      !ruminants ||
      !threeMonths ||
      !sixMonths ||
      !twelveMonths
    ) {
      throw new Error("Some product types or durations not found");
    }

  const productData = [
      // Cereals
      {
        name: "Maize Grain",
        description: "High-quality maize",
        images: ["https://images.unsplash.com/photo-1634467524884-897d0af5e104?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870"],
        currentMarketPricePerKg: 2.5,
        productTypeId: cereals.id,
        durationId: threeMonths.id,
        roi: 12,
        estimatedHarvestQuantityPerPlot: 100,
        daysToHarvestPerPlot: 90,
        minimumNoOfFarmersPerPlot: 2,
        dailyMaintenanceFee: 4000, // 2 farmers × ₦2000/day
      },
      {
        name: "Rice Grain",
        description: "Premium rice",
  images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470"],
        currentMarketPricePerKg: 3.0,
        productTypeId: cereals.id,
        durationId: sixMonths.id,
        roi: 10,
        estimatedHarvestQuantityPerPlot: 120,
        daysToHarvestPerPlot: 120,
        minimumNoOfFarmersPerPlot: 2,
        dailyMaintenanceFee: 4000, // 2 farmers × ₦2000/day
      },
      {
        name: "Sorghum Grain",
        description: "Drought-resistant sorghum",
  images: ["/images/sorghum.jpg"],
        currentMarketPricePerKg: 2.8,
        productTypeId: cereals.id,
        durationId: sixMonths.id,
        roi: 11,
        estimatedHarvestQuantityPerPlot: 90,
        daysToHarvestPerPlot: 80,
        minimumNoOfFarmersPerPlot: 1,
        dailyMaintenanceFee: 2000, // 1 farmer × ₦2000/day
      },

      // Tubers
      {
        name: "Yam Tuber",
        description: "Starchy yam",
  images: ["/images/yam.jpg"],
        currentMarketPricePerKg: 2.0,
        productTypeId: tubers.id,
        durationId: sixMonths.id,
        roi: 13,
        estimatedHarvestQuantityPerPlot: 110,
        daysToHarvestPerPlot: 100,
        minimumNoOfFarmersPerPlot: 2,
        dailyMaintenanceFee: 4000, // 2 farmers × ₦2000/day
      },
      {
        name: "Cassava Root",
        description: "Starchy cassava",
  images: ["https://images.unsplash.com/photo-1757283961570-682154747d9c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870"],
        currentMarketPricePerKg: 1.8,
        productTypeId: tubers.id,
        durationId: sixMonths.id,
        roi: 12,
        estimatedHarvestQuantityPerPlot: 80,
        daysToHarvestPerPlot: 70,
        minimumNoOfFarmersPerPlot: 1,
        dailyMaintenanceFee: 2000, // 1 farmer × ₦2000/day
      },

      // Vegetables
      {
        name: "Tomato Fruit",
        description: "Juicy tomatoes",
  images: ["https://images.unsplash.com/photo-1724128239194-4bde5d240555?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774"],
        currentMarketPricePerKg: 3.5,
        productTypeId: vegetables.id,
        durationId: threeMonths.id,
        roi: 15,
        estimatedHarvestQuantityPerPlot: 95,
        daysToHarvestPerPlot: 85,
        minimumNoOfFarmersPerPlot: 1,
        dailyMaintenanceFee: 2000, // 1 farmer × ₦2000/day
      },
      {
        name: "Carrot Root",
        description: "Fresh carrots",
  images: ["https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=927"],
        currentMarketPricePerKg: 2.2,
        productTypeId: vegetables.id,
        durationId: threeMonths.id,
        roi: 14,
        estimatedHarvestQuantityPerPlot: 105,
        daysToHarvestPerPlot: 95,
        minimumNoOfFarmersPerPlot: 2,
        dailyMaintenanceFee: 4000, // 2 farmers × ₦2000/day
      },
      {
        name: "Okra Pods",
        description: "Green okra pods",
  images: ["https://images.unsplash.com/photo-1558408525-1092038389ae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880, https://images.unsplash.com/photo-1551207195-70cb13347c1a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9rcmF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600"],
        currentMarketPricePerKg: 2.7,
        productTypeId: vegetables.id,
        durationId: threeMonths.id,
        roi: 13,
        estimatedHarvestQuantityPerPlot: 130,
        daysToHarvestPerPlot: 110,
        minimumNoOfFarmersPerPlot: 3,
        dailyMaintenanceFee: 6000, // 3 farmers × ₦2000/day
      },

      // Legumes
      {
        name: "Cowpea Seeds",
        description: "Black-eyed cowpea",
  images: ["/images/cowpea.jpg"],
        currentMarketPricePerKg: 2.6,
        productTypeId: legumes.id,
        durationId: threeMonths.id,
        roi: 11,
        estimatedHarvestQuantityPerPlot: 140,
        daysToHarvestPerPlot: 115,
        minimumNoOfFarmersPerPlot: 3,
        dailyMaintenanceFee: 6000, // 3 farmers × ₦2000/day
      },
      {
        name: "Soybean Seeds",
        description: "Protein-rich soybeans",
  images: ["https://images.unsplash.com/photo-1639843606783-b2f9c50a7468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1373"],
        currentMarketPricePerKg: 3.0,
        productTypeId: legumes.id,
        durationId: sixMonths.id,
        roi: 12,
        estimatedHarvestQuantityPerPlot: 150,
        daysToHarvestPerPlot: 120,
        minimumNoOfFarmersPerPlot: 3,
        dailyMaintenanceFee: 6000, // 3 farmers × ₦2000/day
      },

      // Fruits
      {
        name: "Watermelon Fruit",
        description: "Sweet watermelon",
  images: ["https://images.unsplash.com/photo-1621961048737-a9993789e1ad?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774"],
        currentMarketPricePerKg: 1.5,
        productTypeId: fruits.id,
        durationId: threeMonths.id,
        roi: 10,
        estimatedHarvestQuantityPerPlot: 160,
        daysToHarvestPerPlot: 130,
        minimumNoOfFarmersPerPlot: 4,
        dailyMaintenanceFee: 8000, // 4 farmers × ₦2000/day
      },
      {
        name: "Pineapple Fruit",
        description: "Juicy pineapple",
  images: ["/images/pineapple.jpg"],
        currentMarketPricePerKg: 2.4,
        productTypeId: fruits.id,
        durationId: sixMonths.id,
        roi: 13,
        estimatedHarvestQuantityPerPlot: 170,
        daysToHarvestPerPlot: 140,
        minimumNoOfFarmersPerPlot: 4,
        dailyMaintenanceFee: 8000, // 4 farmers × ₦2000/day
      },
      {
        name: "Mango Fruit",
        description: "Tropical mango",
  images: ["https://images.unsplash.com/photo-1702040242599-46809572ffce?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735"],
        currentMarketPricePerKg: 3.0,
        productTypeId: fruits.id,
        durationId: twelveMonths.id,
        roi: 16,
        estimatedHarvestQuantityPerPlot: 180,
        daysToHarvestPerPlot: 150,
        minimumNoOfFarmersPerPlot: 5,
        dailyMaintenanceFee: 10000, // 5 farmers × ₦2000/day
      },

      // Spices
      {
        name: "Ginger Root",
        description: "Aromatic ginger",
  images: ["/images/ginger.jpg"],
        currentMarketPricePerKg: 4.0,
        productTypeId: spices.id,
        durationId: sixMonths.id,
        roi: 18,
        estimatedHarvestQuantityPerPlot: 190,
        daysToHarvestPerPlot: 160,
        minimumNoOfFarmersPerPlot: 5,
        dailyMaintenanceFee: 10000, // 5 farmers × ₦2000/day
      },
      {
        name: "Garlic Bulbs",
        description: "Flavorful garlic",
  images: ["/images/garlic.jpg"],
        currentMarketPricePerKg: 3.5,
        productTypeId: spices.id,
        durationId: threeMonths.id,
        roi: 17,
        estimatedHarvestQuantityPerPlot: 200,
        daysToHarvestPerPlot: 170,
        minimumNoOfFarmersPerPlot: 6,
        dailyMaintenanceFee: 12000, // 6 farmers × ₦2000/day
      },

      // Poultry
      {
        name: "Chicken Meat",
        description: "Fresh chicken",
  images: ["/images/chickens.jpg"],
        currentMarketPricePerKg: 5.0,
        productTypeId: poultry.id,
        durationId: threeMonths.id,
        roi: 20,
        estimatedHarvestQuantityPerPlot: 210,
        daysToHarvestPerPlot: 180,
        minimumNoOfFarmersPerPlot: 6,
        dailyMaintenanceFee: 12000, // 6 farmers × ₦2000/day
      },
      {
        name: "Turkey Meat",
        description: "Meaty turkey",
  images: ["/images/turkeys.jpg"],
        currentMarketPricePerKg: 6.5,
        productTypeId: poultry.id,
        durationId: sixMonths.id,
        roi: 22,
        estimatedHarvestQuantityPerPlot: 220,
        daysToHarvestPerPlot: 190,
        minimumNoOfFarmersPerPlot: 7,
        dailyMaintenanceFee: 14000, // 7 farmers × ₦2000/day
      },

      // Ruminants
      {
        name: "Cattle Beef",
        description: "Beef cattle",
  images: ["/images/cattle.jpg"],
        currentMarketPricePerKg: 10.0,
        productTypeId: ruminants.id,
        durationId: twelveMonths.id,
        roi: 25,
        estimatedHarvestQuantityPerPlot: 230,
        daysToHarvestPerPlot: 200,
        minimumNoOfFarmersPerPlot: 7,
        dailyMaintenanceFee: 14000, // 7 farmers × ₦2000/day
      },
      {
        name: "Goat Meat",
        description: "Goat livestock",
  images: ["/images/goats.jpg"],
        currentMarketPricePerKg: 8.0,
        productTypeId: ruminants.id,
        durationId: sixMonths.id,
        roi: 21,
        estimatedHarvestQuantityPerPlot: 240,
        daysToHarvestPerPlot: 210,
        minimumNoOfFarmersPerPlot: 8,
        dailyMaintenanceFee: 16000, // 8 farmers × ₦2000/day
      },
    ];

    // Add id and createdBy to each product, and keep images separate
    const productDataWithIds = productData.map((product) => {
      const { images, ...rest } = product;
      return {
        id: crypto.randomUUID(),
        ...rest,
        createdBy: adminId,
        images, // keep for later, no underscore
      };
    });

    // Create products without images
    await prisma.product.createMany({
      data: productDataWithIds.map((prod) => {
        // Remove images property for createMany
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { images, ...rest } = prod;
        return rest;
      }),
      skipDuplicates: true,
    });

    // Fetch all products to get their IDs
    const allProducts = await prisma.product.findMany();

    // Insert images for each product (only if they don't already exist)
    for (const prod of productDataWithIds) {
      const dbProduct = allProducts.find((p) => p.name === prod.name && p.description === prod.description);
      if (dbProduct && Array.isArray(prod.images)) {
        for (const url of prod.images) {
          // Check if image already exists for this product
          const existingImage = await prisma.productImage.findFirst({
            where: {
              url,
              productId: dbProduct.id,
            },
          });
          
          // Only create if it doesn't exist
          if (!existingImage) {
            await prisma.productImage.create({
              data: {
                url,
                productId: dbProduct.id,
              },
            });
          }
        }
      }
    }

    // Return all products from DB for further use
    // Return all products with images as array of Product (with images as string[])
    const dbProducts = await prisma.product.findMany({
      include: { images: true },
    });
    return dbProducts.map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images.map((img) => img.url) : [],
    }));
  } catch (error) {
    console.error("Failed to seed products:", error);
    throw error;
  }
}
