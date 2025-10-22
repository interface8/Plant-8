import prisma from "../prisma";
import crypto from "crypto";

interface Product {
  id: string;
  name: string;
  productTypeId: string;
  durationId: string;
  roi: number | null;
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
        imageUrl: "https://images.unsplash.com/photo-1634467524884-897d0af5e104?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
        currentMarketPricePerKg: 2.5,
        productTypeId: cereals.id,
        durationId: threeMonths.id,
        roi: 12,
      },
      {
        name: "Rice Grain",
        description: "Premium rice",
        imageUrl: "/images/rice.jpg",
        currentMarketPricePerKg: 3.0,
        productTypeId: cereals.id,
        durationId: sixMonths.id,
        roi: 10,
      },
      {
        name: "Sorghum Grain",
        description: "Drought-resistant sorghum",
        imageUrl: "/images/sorghum.jpg",
        currentMarketPricePerKg: 2.8,
        productTypeId: cereals.id,
        durationId: sixMonths.id,
        roi: 11,
      },

      // Tubers
      {
        name: "Yam Tuber",
        description: "Starchy yam",
        imageUrl: "/images/yam.jpg",
        currentMarketPricePerKg: 2.0,
        productTypeId: tubers.id,
        durationId: sixMonths.id,
        roi: 13,
      },
      {
        name: "Cassava Root",
        description: "Starchy cassava",
        imageUrl: "https://images.unsplash.com/photo-1757283961570-682154747d9c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
        currentMarketPricePerKg: 1.8,
        productTypeId: tubers.id,
        durationId: sixMonths.id,
        roi: 12,
      },

      // Vegetables
      {
        name: "Tomato Fruit",
        description: "Juicy tomatoes",
        imageUrl: "https://images.unsplash.com/photo-1724128239194-4bde5d240555?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
        currentMarketPricePerKg: 3.5,
        productTypeId: vegetables.id,
        durationId: threeMonths.id,
        roi: 15,
      },
      {
        name: "Carrot Root",
        description: "Fresh carrots",
        imageUrl: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=927",
        currentMarketPricePerKg: 2.2,
        productTypeId: vegetables.id,
        durationId: threeMonths.id,
        roi: 14,
      },
      {
        name: "Okra Pods",
        description: "Green okra pods",
        imageUrl: "/images/okra.jpg",
        currentMarketPricePerKg: 2.7,
        productTypeId: vegetables.id,
        durationId: threeMonths.id,
        roi: 13,
      },

      // Legumes
      {
        name: "Cowpea Seeds",
        description: "Black-eyed cowpea",
        imageUrl: "/images/cowpea.jpg",
        currentMarketPricePerKg: 2.6,
        productTypeId: legumes.id,
        durationId: threeMonths.id,
        roi: 11,
      },
      {
        name: "Soybean Seeds",
        description: "Protein-rich soybeans",
        imageUrl: "/images/soybean.jpg",
        currentMarketPricePerKg: 3.0,
        productTypeId: legumes.id,
        durationId: sixMonths.id,
        roi: 12,
      },

      // Fruits
      {
        name: "Watermelon Fruit",
        description: "Sweet watermelon",
        imageUrl: "https://images.unsplash.com/photo-1621961048737-a9993789e1ad?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
        currentMarketPricePerKg: 1.5,
        productTypeId: fruits.id,
        durationId: threeMonths.id,
        roi: 10,
      },
      {
        name: "Pineapple Fruit",
        description: "Juicy pineapple",
        imageUrl: "/images/pineapple.jpg",
        currentMarketPricePerKg: 2.4,
        productTypeId: fruits.id,
        durationId: sixMonths.id,
        roi: 13,
      },
      {
        name: "Mango Fruit",
        description: "Tropical mango",
        imageUrl: "https://images.unsplash.com/photo-1702040242599-46809572ffce?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735",
        currentMarketPricePerKg: 3.0,
        productTypeId: fruits.id,
        durationId: twelveMonths.id,
        roi: 16,
      },

      // Spices
      {
        name: "Ginger Root",
        description: "Aromatic ginger",
        imageUrl: "/images/ginger.jpg",
        currentMarketPricePerKg: 4.0,
        productTypeId: spices.id,
        durationId: sixMonths.id,
        roi: 18,
      },
      {
        name: "Garlic Bulbs",
        description: "Flavorful garlic",
        imageUrl: "/images/garlic.jpg",
        currentMarketPricePerKg: 3.5,
        productTypeId: spices.id,
        durationId: threeMonths.id,
        roi: 17,
      },

      // Poultry
      {
        name: "Chicken Meat",
        description: "Fresh chicken",
        imageUrl: "/images/chickens.jpg",
        currentMarketPricePerKg: 5.0,
        productTypeId: poultry.id,
        durationId: threeMonths.id,
        roi: 20,
      },
      {
        name: "Turkey Meat",
        description: "Meaty turkey",
        imageUrl: "/images/turkeys.jpg",
        currentMarketPricePerKg: 6.5,
        productTypeId: poultry.id,
        durationId: sixMonths.id,
        roi: 22,
      },

      // Ruminants
      {
        name: "Cattle Beef",
        description: "Beef cattle",
        imageUrl: "/images/cattle.jpg",
        currentMarketPricePerKg: 10.0,
        productTypeId: ruminants.id,
        durationId: twelveMonths.id,
        roi: 25,
      },
      {
        name: "Goat Meat",
        description: "Goat livestock",
        imageUrl: "/images/goats.jpg",
        currentMarketPricePerKg: 8.0,
        productTypeId: ruminants.id,
        durationId: sixMonths.id,
        roi: 21,
      },
    ];

    // Add id and createdBy to each product
    const productDataWithIds = productData.map((product) => ({
      id: crypto.randomUUID(),
      ...product,
      createdBy: adminId,
    }));

    await prisma.product.createMany({
      data: productDataWithIds,
      skipDuplicates: true,
    });

    // Return all products from DB for further use
    const allProducts = await prisma.product.findMany();
    return allProducts;
  } catch (error) {
    console.error("Failed to seed products:", error);
    throw error;
  }
}
