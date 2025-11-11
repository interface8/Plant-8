import { productSchema } from "@/lib/validators/product-schema-validation";
import type { z } from "zod";
import crypto from "crypto";

export async function createProduct(data: z.infer<typeof productSchema>) {
  // Validate input
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    throw parsed.error;
  }
  const {
    name,
    description,
    productTypeId,
    durationId,
    images,
    currentMarketPricePerKg,
    farmerMonthlyPayment,
    roi,
    estimatedHarvestQuantityPerPlot,
    daysToHarvestPerPlot,
    minimumNoOfFarmersPerPlot,
  } = parsed.data;
  return await prisma.product.create({
    data: {
      id: crypto.randomUUID(),
      name,
      description,
      productTypeId,
      durationId,
      currentMarketPricePerKg,
      farmerMonthlyPayment,
      roi,
      estimatedHarvestQuantityPerPlot,
      daysToHarvestPerPlot,
      minimumNoOfFarmersPerPlot,
      images: {
        create: images.map((url: string) => ({ url })),
      },
    },
    include: { images: true },
  });
}

export async function updateProduct(
  id: string,
  data: z.infer<typeof productSchema>
) {
  // Validate input
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    throw parsed.error;
  }
  const {
    name,
    description,
    productTypeId,
    durationId,
    images,
    currentMarketPricePerKg,
    farmerMonthlyPayment,
    roi,
    estimatedHarvestQuantityPerPlot,
    daysToHarvestPerPlot,
    minimumNoOfFarmersPerPlot,
  } = parsed.data;
  // Remove all old images and add new ones
  await prisma.productImage.deleteMany({ where: { productId: id } });
  return await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      productTypeId,
      durationId,
      currentMarketPricePerKg,
      farmerMonthlyPayment,
      roi,
      estimatedHarvestQuantityPerPlot,
      daysToHarvestPerPlot,
      minimumNoOfFarmersPerPlot,
      images: {
        create: images.map((url: string) => ({ url })),
      },
    },
    include: { images: true },
  });
}

export async function deleteProduct(id: string) {
  return await prisma.product.delete({ where: { id } });
}
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        productTypeId: true,
        durationId: true,
        images: { select: { url: true } },
        currentMarketPricePerKg: true,
        farmerMonthlyPayment: true,
        roi: true,
        estimatedHarvestQuantityPerPlot: true,
        daysToHarvestPerPlot: true,
        minimumNoOfFarmersPerPlot: true,
        dailyMaintenanceFee: true,
        ProductType: { select: { id: true, name: true } },
        duration: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return products.map((product) => ({
      ...product,
      images: Array.isArray(product.images) ? product.images.map((img) => img.url) : [],
      roi: product.roi === null ? 10 : product.roi,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
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
        images: { select: { url: true } },
        currentMarketPricePerKg: true,
        farmerMonthlyPayment: true,
        roi: true,
        estimatedHarvestQuantityPerPlot: true,
        daysToHarvestPerPlot: true,
        minimumNoOfFarmersPerPlot: true,
        dailyMaintenanceFee: true,
        ProductType: { select: { id: true, name: true } },
        duration: { select: { id: true, name: true } },
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
    if (!product) return null;
    return {
      ...product,
      images: Array.isArray(product.images) ? product.images.map((img) => img.url) : [],
    };
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
