"use server";

import prisma from "@/db/prisma";
import { Product } from "@/types/product";
import { Land } from "@/types/land";
import { State } from "@/types/state";

export async function getProduct(productId: string): Promise<Product | null> {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(productId)) {
    console.error(`Invalid product ID format: ${productId}`);
    return null;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
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
        ProductType: { select: { id: true, name: true } },
        duration: { select: { id: true, name: true } },
      },
    });
    if (!product) return null;
    // Always return roi, defaulting to 0 if missing
    return {
      ...product,
      images: Array.isArray(product.images) ? product.images.map((img: { url: string }) => img.url) : [],
      roi: product.roi ?? 10,
      estimatedHarvestQuantityPerPlot: product.estimatedHarvestQuantityPerPlot,
      daysToHarvestPerPlot: product.daysToHarvestPerPlot,
      minimumNoOfFarmersPerPlot: product.minimumNoOfFarmersPerPlot,
      duration: product.duration
        ? { id: product.duration.id, name: product.duration.name }
        : { id: '', name: '' },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getLands(): Promise<Land[]> {
  try {
    const lands = await prisma.land.findMany({
      distinct: ["id"],
      select: {
        id: true,
        name: true,
        gpsCoordinates: true,
        halfPlotPrice: true,
        fullPlotPrice: true,
        imageUrl: true,
        locationId: true,
        farmerDailyWage: true,
        fertilizerCostPerPlot: true,
        inspectionDailyFee: true,
        location: {
          select: {
            id: true,
            name: true,
            state: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });
    return lands;
  } catch (error) {
    console.error("Error fetching lands:", error);
    return [];
  }
}

export async function getStates(): Promise<State[]> {
  try {
    const states = await prisma.state.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });
    return states;
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
}

export async function getDurations(): Promise<{ id: string; name: string }[]> {
  try {
    const durations = await prisma.duration.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });
    return durations;
  } catch (error) {
    console.error("Error fetching durations:", error);
    return [];
  }
}

export async function createInvestment(data: {
  userId: string;
  productId: string;
  productTypeId: string;
  landId: string;
  plotSize: "HALF" | "FULL";
  numberOfPlots: number;
  numberOfTerms: number;
  amount: number;
  durationId: string;
}) {
  try {
    // Fetch product to get ROI
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      select: { roi: true },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

  const roi = product.roi ?? 10;
  const expectedReturn = data.amount * (1 + roi / 100);

    const investment = await prisma.investment.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        productTypeId: data.productTypeId,
        landId: data.landId,
        plotSize: data.plotSize,
        numberOfPlots: data.numberOfPlots,
        numberOfTerms: data.numberOfTerms,
        amount: data.amount,
        expectedReturn: expectedReturn,
        progress: 0,
        status: "PENDING",
        createdAt: new Date(),
        createdBy: data.userId,
      },
    });
    return { success: true, investment };
  } catch (error) {
    console.error("Error creating investment:", error);
    return { success: false, error: "Failed to create investment" };
  }
}
