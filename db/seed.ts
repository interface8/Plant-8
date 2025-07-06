import "dotenv/config";
import prisma from "./prisma";

async function main() {
  try {
    const roles = await prisma.role.createMany({
      data: [{ name: "USER" }, { name: "ADMIN" }],
      skipDuplicates: true,
    });
    console.log(`Seeded ${roles.count} roles (USER, ADMIN)`);
  } catch (error) {
    console.error("Failed to seed roles:", error);
    throw error;
  }

  try {
    const addresstype = await prisma.addressType.createMany({
      data: [
        { id: crypto.randomUUID(), name: "Home" },
        { id: crypto.randomUUID(), name: "Work" },
        { id: crypto.randomUUID(), name: "Other" },
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${addresstype.count} addresstype (Home, Work, Others)`);
  } catch (error) {
    console.error("Failed to seed addresstype:", error);
    throw error;
  }

  try {
    const cropId = crypto.randomUUID();
    const livestockId = crypto.randomUUID();
    const productTypes = await prisma.productType.createMany({
      data: [
        {
          id: crypto.randomUUID(),
          name: "3 months",
          category: "Duration",
          description: "Short-term investment",
        },
        {
          id: crypto.randomUUID(),
          name: "6 months",
          category: "Duration",
          description: "Mid-term investment",
        },
        {
          id: crypto.randomUUID(),
          name: "1 year",
          category: "Duration",
          description: "Long-term investment",
        },
        {
          id: cropId,
          name: "Crop",
          category: "Class",
          description: "Crop investments",
        },
        {
          id: crypto.randomUUID(),
          name: "Maize",
          category: "Class",
          prevId: cropId,
          description: "Maize crop",
        },
        {
          id: crypto.randomUUID(),
          name: "Rice",
          category: "Class",
          prevId: cropId,
          description: "Rice crop",
        },
        {
          id: livestockId,
          name: "Livestock",
          category: "Class",
          description: "Livestock investments",
        },
        {
          id: crypto.randomUUID(),
          name: "Cattle",
          category: "Class",
          prevId: livestockId,
          description: "Cattle livestock",
        },
        {
          id: crypto.randomUUID(),
          name: "Poultry",
          category: "Class",
          prevId: livestockId,
          description: "Poultry livestock",
        },
      ],
      skipDuplicates: true,
    });
    console.log(
      `Seeded ${productTypes.count} product types (Duration & Class)`
    );
  } catch (error) {
    console.error("Failed to seed product types:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Prisma client disconnected");
  });
