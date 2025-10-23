import prisma from "@/db/prisma";
import { Product } from "@/types/product";
import { Land } from "@/types/land";

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
        ProductType: { select: { id: true, name: true } },
        duration: { select: { id: true, name: true } },
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

export async function getLand(landId: string): Promise<Land | null> {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(landId)) {
    console.error(`Invalid land ID format: ${landId}`);
    return null;
  }

  try {
    const land = await prisma.land.findUnique({
      where: { id: landId },
      select: {
        id: true,
        name: true,
        gpsCoordinates: true,
        halfPlotPrice: true,
        fullPlotPrice: true,
        imageUrl: true,
        locationId: true,
        location: {
          select: {
            id: true,
            name: true,
            state: { select: { id: true, name: true } },
          },
        },
      },
    });
    return land;
  } catch (error) {
    console.error("Error fetching land:", error);
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

export async function getLocations() {
  try {
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        name: true,
        state: { select: { id: true, name: true } },
      },
      orderBy: { name: "asc" },
    });
    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

export async function getStates() {
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

export async function getDuration(durationId: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(durationId)) {
    console.error(`Invalid duration ID format: ${durationId}`);
    return null;
  }

  try {
    const duration = await prisma.duration.findUnique({
      where: { id: durationId },
      select: { id: true, name: true },
    });
    return duration;
  } catch (error) {
    console.error("Error fetching duration:", error);
    return null;
  }
}

export async function getDurations() {
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
