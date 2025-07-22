import prisma from "../prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface User {
  id: string;
  email: string;
}

export async function seedUsers(): Promise<User> {
  try {
    const adminId = "581b8e3d-8958-4133-8ce9-d0db66a37af4";
    const adminRole = await prisma.role.findUnique({
      where: { name: "ADMIN" },
    });
    const userRole = await prisma.role.findUnique({ where: { name: "USER" } });

    if (!adminRole || !userRole) throw new Error("Roles not found");

    const hashedAdminPassword = await bcrypt.hash("Qa12345678$", 12);
    await prisma.user.upsert({
      where: { id: adminId },
      update: {},
      create: {
        id: adminId,
        name: "Quadri",
        email: "quadriayomiidey@gmail.com",
        password: hashedAdminPassword,
        createdBy: adminId,
        roles: {
          create: {
            roleId: adminRole.id,
            assignedBy: adminId,
          },
        },
      },
    });

    const users = [
      {
        name: "Mojisola",
        email: "mojisola@mailinator.com",
        password: "Mojisola@25",
      },
      {
        name: "Uthman",
        email: "giwauthman8@gmail.com",
        password: "Interface8$",
      },
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          id: crypto.randomUUID(),
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          createdBy: adminId,
          roles: {
            create: {
              roleId: userRole.id,
              assignedBy: adminId,
            },
          },
        },
      });
    }

    const admin = await prisma.user.findFirst({ where: { id: adminId } });
    if (!admin) throw new Error("Admin user not found");
    return admin;
  } catch (error) {
    console.error("Failed to seed users:", error);
    throw error;
  }
}
