import "dotenv/config";
import prisma from "../prisma";
import { seedRoles } from "./seedRoles";
import { seedUsers } from "./seedUsers";
import { seedDurations } from "./seedDurations";
import { seedProductTypes } from "./seedProductTypes";
import { seedProducts } from "./seedProducts";
import { seedInvestments } from "./seedInvestments";
import { seedAddressTypes } from "./seedAddressTypes";
import { seedPreTasks } from "./seedPreTasks";
import { seedLands } from "./seedLands";

async function main() {
  try {
    const roles = await seedRoles();
    console.log(`Seeded ${roles.count} roles`);

    const admin = await seedUsers();
    if (!admin) throw new Error("Failed to seed admin user");
    console.log(`Seeded admin and users`);

    const addressTypes = await seedAddressTypes();
    console.log(`Seeded ${addressTypes.count} address types`);

    const durations = await seedDurations(admin.id);
    console.log(`Seeded ${durations.count} durations`);

    const productTypes = await seedProductTypes(admin.id);
    console.log(`Seeded ${productTypes.count} product types`);

    const products = await seedProducts(admin.id);
    console.log(`Seeded ${products.length} products`);

    const preTasks = await seedPreTasks(admin.id, products);
    console.log(`Seeded ${preTasks.length} pre-tasks`);

    const lands = await seedLands();
    console.log(`Seeded ${lands} lands`);

    const investments = await seedInvestments(admin.id, productTypes, products);
    console.log(`Seeded ${investments.count} investments`);
  } catch (error) {
    console.error("Seeding error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log("Prisma client disconnected");
  }
}

main().catch((e) => {
  console.error("Seeding error:", e);
  process.exit(1);
});
