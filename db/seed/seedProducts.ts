import prisma from "../prisma";
import crypto from "crypto";

interface Product {
  id: string;
  name: string;
  productTypeId: string;
  durationId: string;
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
    const oneYear = await prisma.duration.findFirst({
      where: { name: "1 year" },
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
      !oneYear
    ) {
      throw new Error("Some product types or durations not found");
    }

    const productData = [
      // Cereals
      {
        name: "Maize Grain",
        description: "High-quality maize",
        imageUrl: "/images/maize.jpg",
        currentMarketPricePerKg: 2.5,
        productTypeId: cereals.id,
        durationId: threeMonths.id,
      },
      {
        name: "Rice Grain",
        description: "Premium rice",
        imageUrl: "/images/rice.jpg",
        currentMarketPricePerKg: 3.0,
        productTypeId: cereals.id,
        durationId: sixMonths.id,
      },
      {
        name: "Sorghum Grain",
        description: "Drought-resistant sorghum",
        imageUrl: "/images/sorghum.jpg",
        currentMarketPricePerKg: 2.8,
        productTypeId: cereals.id,
        durationId: sixMonths.id,
      },

      // Tubers
      {
        name: "Yam Tuber",
        description: "Starchy yam",
        imageUrl: "/images/yam.jpg",
        currentMarketPricePerKg: 2.0,
        productTypeId: tubers.id,
        durationId: sixMonths.id,
      },
      {
        name: "Cassava Root",
        description: "Starchy cassava",
        imageUrl: "/images/cassava.jpg",
        currentMarketPricePerKg: 1.8,
        productTypeId: tubers.id,
        durationId: sixMonths.id,
      },

      // Vegetables
      {
        name: "Tomato Fruit",
        description: "Juicy tomatoes",
        imageUrl: "/images/tomato.jpg",
        currentMarketPricePerKg: 3.5,
        productTypeId: vegetables.id,
        durationId: threeMonths.id,
      },
      {
        name: "Carrot Root",
        description: "Fresh carrots",
        imageUrl: "/images/carrot.jpg",
        currentMarketPricePerKg: 2.2,
        productTypeId: vegetables.id,
        durationId: threeMonths.id,
      },
      {
        name: "Okra Pods",
        description: "Green okra pods",
        imageUrl: "/images/okra.jpg",
        currentMarketPricePerKg: 2.7,
        productTypeId: vegetables.id,
        durationId: threeMonths.id,
      },

      // Legumes
      {
        name: "Cowpea Seeds",
        description: "Black-eyed cowpea",
        imageUrl: "/images/cowpea.jpg",
        currentMarketPricePerKg: 2.6,
        productTypeId: legumes.id,
        durationId: threeMonths.id,
      },
      {
        name: "Soybean Seeds",
        description: "Protein-rich soybeans",
        imageUrl: "/images/soybean.jpg",
        currentMarketPricePerKg: 3.0,
        productTypeId: legumes.id,
        durationId: sixMonths.id,
      },

      // Fruits
      {
        name: "Watermelon Fruit",
        description: "Sweet watermelon",
        imageUrl: "/images/watermelon.jpg",
        currentMarketPricePerKg: 1.5,
        productTypeId: fruits.id,
        durationId: threeMonths.id,
      },
      {
        name: "Pineapple Fruit",
        description: "Juicy pineapple",
        imageUrl: "/images/pineapple.jpg",
        currentMarketPricePerKg: 2.4,
        productTypeId: fruits.id,
        durationId: sixMonths.id,
      },
      {
        name: "Mango Fruit",
        description: "Tropical mango",
        imageUrl: "/images/mango.jpg",
        currentMarketPricePerKg: 3.0,
        productTypeId: fruits.id,
        durationId: oneYear.id,
      },

      // Spices
      {
        name: "Ginger Root",
        description: "Aromatic ginger",
        imageUrl: "/images/ginger.jpg",
        currentMarketPricePerKg: 4.0,
        productTypeId: spices.id,
        durationId: sixMonths.id,
      },
      {
        name: "Garlic Bulbs",
        description: "Flavorful garlic",
        imageUrl: "/images/garlic.jpg",
        currentMarketPricePerKg: 3.5,
        productTypeId: spices.id,
        durationId: threeMonths.id,
      },

      // Poultry
      {
        name: "Chicken Meat",
        description: "Fresh chicken",
        imageUrl: "/images/chickens.jpg",
        currentMarketPricePerKg: 5.0,
        productTypeId: poultry.id,
        durationId: threeMonths.id,
      },
      {
        name: "Turkey Meat",
        description: "Meaty turkey",
        imageUrl: "/images/turkeys.jpg",
        currentMarketPricePerKg: 6.5,
        productTypeId: poultry.id,
        durationId: sixMonths.id,
      },

      // Ruminants
      {
        name: "Cattle Beef",
        description: "Beef cattle",
        imageUrl: "/images/cattle.jpg",
        currentMarketPricePerKg: 10.0,
        productTypeId: ruminants.id,
        durationId: oneYear.id,
      },
      {
        name: "Goat Meat",
        description: "Goat livestock",
        imageUrl: "/images/goats.jpg",
        currentMarketPricePerKg: 8.0,
        productTypeId: ruminants.id,
        durationId: sixMonths.id,
      },
    ];

    const products: Product[] = [];
    for (const product of productData) {
      const createdProduct = await prisma.product.create({
        data: {
          id: crypto.randomUUID(),
          ...product,
          createdBy: adminId,
        },
      });
      products.push(createdProduct);
    }

    return products;
  } catch (error) {
    console.error("Failed to seed products:", error);
    throw error;
  }
}
