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
    throw error; // Ensure the error propagates to exit with failure
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
