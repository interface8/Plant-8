import prisma from "../prisma";
import crypto from "crypto";

interface ProductTypeResult {
  count: number;
  cropId: string;
  livestockId: string;
}

export async function seedProductTypes(
  adminId: string
): Promise<ProductTypeResult> {
  try {
    // Categories
    const cropId = crypto.randomUUID();
    const livestockId = crypto.randomUUID();
    
    // First, create main categories
    await prisma.productType.createMany({
      data: [
        {
          id: cropId,
          name: "Crop",
          description: "Crop investments",
          createdBy: adminId,
        },
        {
          id: livestockId,
          name: "Livestock",
          description: "Livestock investments",
          createdBy: adminId,
        },
      ],
      skipDuplicates: true,
    });

    // Then create subcategories
    const result = await prisma.productType.createMany({
      data: [
        {
          id: crypto.randomUUID(),
          name: "Cereals",
          description: "Grain crops cultivated for food",
          prevId: cropId,
          createdBy: adminId,
        },
        {
          id: crypto.randomUUID(),
          name: "Tubers",
          description: "Crops grown for their underground storage organs",
          prevId: cropId,
          createdBy: adminId,
        },
        {
          id: crypto.randomUUID(),
          name: "Vegetables",
          description: "Leafy and fruit vegetables",
          prevId: cropId,
          createdBy: adminId,
        },
        {
          id: crypto.randomUUID(),
          name: "Fruits",
          description: "Edible fruits from plants",
          prevId: cropId,
          createdBy: adminId,
        },
        {
          id: crypto.randomUUID(),
          name: "Legumes",
          description: "Protein-rich nitrogen-fixers",
          prevId: cropId,
          createdBy: adminId,
        },
        {
          id: crypto.randomUUID(),
          name: "Spice Crops",
          description: "Flavoring and aromatic crops",
          prevId: cropId,
          createdBy: adminId,
        },
        {
          id: crypto.randomUUID(),
          name: "Ruminants",
          description: "Animals with multi-chambered stomachs",
          prevId: livestockId,
          createdBy: adminId,
        },
        {
          id: crypto.randomUUID(),
          name: "Poultry",
          description: "Domesticated birds raised for meat or eggs",
          prevId: livestockId,
          createdBy: adminId,
        },
      ],
      skipDuplicates: true,
    });

    // Return the count plus 2 for the main categories
    return { 
      count: result.count + 2, 
      cropId, 
      livestockId 
    };
  } catch (error) {
    console.error("Failed to seed product types:", error);
    throw error;
  }
}