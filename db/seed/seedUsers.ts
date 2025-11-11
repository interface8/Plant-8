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
    const customerRole = await prisma.role.findUnique({ where: { name: "CUSTOMER" } });
    const farmerRole = await prisma.role.findUnique({ where: { name: "FARMER" } });
    const investorRole = await prisma.role.findUnique({ where: { name: "INVESTOR" } });

    if (!adminRole || !userRole) throw new Error("Required roles not found");

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
        roleIds: [userRole.id],
      },
      {
        name: "Uthman",
        email: "giwauthman8@gmail.com",
        password: "Interface8$",
        roleIds: [userRole.id],
      },
    ];

    // Add farmers
    if (farmerRole) {
      users.push(
        {
          name: "Adebayo Ogunleye",
          email: "adebayo.farmer@mailinator.com",
          password: "Farmer@123",
          roleIds: [farmerRole.id, userRole.id],
        },
        {
          name: "Chioma Nwosu",
          email: "chioma.farmer@mailinator.com",
          password: "Farmer@123",
          roleIds: [farmerRole.id, userRole.id],
        },
        {
          name: "Ibrahim Musa",
          email: "ibrahim.farmer@mailinator.com",
          password: "Farmer@123",
          roleIds: [farmerRole.id, userRole.id],
        }
      );
    }

    // Add investors
    if (investorRole) {
      users.push(
        {
          name: "Folake Adeleke",
          email: "folake.investor@mailinator.com",
          password: "Investor@123",
          roleIds: [investorRole.id, userRole.id],
        },
        {
          name: "Emeka Okafor",
          email: "emeka.investor@mailinator.com",
          password: "Investor@123",
          roleIds: [investorRole.id, userRole.id],
        },
        {
          name: "Aisha Bello",
          email: "aisha.investor@mailinator.com",
          password: "Investor@123",
          roleIds: [investorRole.id, userRole.id],
        }
      );
    }

    // Add customers
    if (customerRole) {
      users.push(
        {
          name: "Oluwaseun Bakare",
          email: "oluwaseun.customer@mailinator.com",
          password: "Customer@123",
          roleIds: [customerRole.id, userRole.id],
        },
        {
          name: "Ngozi Okonkwo",
          email: "ngozi.customer@mailinator.com",
          password: "Customer@123",
          roleIds: [customerRole.id, userRole.id],
        }
      );
    }

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        // Update roles if user exists
        for (const roleId of userData.roleIds) {
          await prisma.userRole.upsert({
            where: {
              userId_roleId: {
                userId: existingUser.id,
                roleId: roleId,
              },
            },
            update: {},
            create: {
              userId: existingUser.id,
              roleId: roleId,
              assignedBy: adminId,
            },
          });
        }
      } else {
        // Create new user with roles
        await prisma.user.create({
          data: {
            id: crypto.randomUUID(),
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            createdBy: adminId,
            roles: {
              create: userData.roleIds.map((roleId) => ({
                roleId: roleId,
                assignedBy: adminId,
              })),
            },
          },
        });
      }
    }

    console.log(`✅ Seeded ${users.length + 1} users with appropriate roles`);

    const admin = await prisma.user.findFirst({ where: { id: adminId } });
    if (!admin) throw new Error("Admin user not found");
    return admin;
  } catch (error) {
    console.error("Failed to seed users:", error);
    throw error;
  }
}
