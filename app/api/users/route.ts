import { prisma } from "@/db/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signUpSchema } from "@/lib/validators";

type UserWithRoles = {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: Date;
  roles: { name: string }[];
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = signUpSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: { connect: { name: "USER" } },
      },
      include: { roles: { select: { name: true } } },
    });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map((r: { name: string }) => r.name),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        roles: { select: { name: true } },
      },
    });
    return NextResponse.json(
      users.map((user: UserWithRoles) => ({
        ...user,
        roles: user.roles.map((r: { name: string }) => r.name),
      }))
    );
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// import { prisma } from "@/db/prisma";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// // GET /api/users
// export async function GET() {
//   const users = await prisma.user.findMany({
//     include: { roles: { include: { role: true } } },
//   });
//   return NextResponse.json(users);
// }

// // POST /api/users
// export async function POST(req: Request) {
//   const body = await req.json();
//   const hashed = await bcrypt.hash(body.password, 10);

//   const user = await prisma.user.create({
//     data: {
//       name: body.name,
//       email: body.email,
//       password: hashed,
//       roles: {
//         create: body.roleIds.map((roleId: string) => ({
//           role: { connect: { id: roleId } },
//         })),
//       },
//     },
//   });

//   return NextResponse.json(user, { status: 201 });
// }
