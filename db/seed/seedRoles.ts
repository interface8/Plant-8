import prisma from "../prisma";

interface RoleCount {
  count: number;
}

export async function seedRoles(): Promise<RoleCount> {
  try {
    const roles = await prisma.role.createMany({
      data: [
        { name: "USER" },
        { name: "ADMIN" },
        { name: "CUSTOMER" },
        { name: "FARMER" },
        { name: "INVESTOR" },
        { name: "BLOG_MANAGER" },
        { name: "MANAGER" },
      ],
      skipDuplicates: true,
    });
    return roles;
  } catch (error) {
    console.error("Failed to seed roles:", error);
    throw error;
  }
}
