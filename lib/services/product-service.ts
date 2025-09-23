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
    imageUrl,
    currentMarketPricePerKg,
    farmerMonthlyPayment,
  } = parsed.data;
  return await prisma.product.create({
    data: {
      id: crypto.randomUUID(),
      name,
      description,
      productTypeId,
      durationId,
      imageUrl,
      currentMarketPricePerKg,
      farmerMonthlyPayment,
    },
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
    imageUrl,
    currentMarketPricePerKg,
    farmerMonthlyPayment,
  } = parsed.data;
  return await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      productTypeId,
      durationId,
      imageUrl,
      currentMarketPricePerKg,
      farmerMonthlyPayment,
    },
  });
}

export async function deleteProduct(id: string) {
  return await prisma.product.delete({ where: { id } });
}
export async function getProducts(): Promise<Product[]> {
  try {
    return await prisma.product.findMany({
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
      },
      orderBy: { createdAt: "desc" },
    });
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
        imageUrl: true,
        currentMarketPricePerKg: true,
        farmerMonthlyPayment: true,
        ProductType: { select: { id: true, name: true } },
        duration: { select: { id: true, name: true } },
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
