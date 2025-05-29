import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/db/prisma";
import { signUpSchema } from "@/lib/validators";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = signUpSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const userRole = await prisma.role.upsert({
      where: { name: "USER" },
      update: {},
      create: { name: "USER" },
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: {
          create: {
            roleId: userRole.id,
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const roleNames = user.roles.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (userRole: { role: { name: any } }) => userRole.role.name
    );

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: roleNames,
        },
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

// import prisma from "@/db/prisma";
// import { setAuthCookie } from "@/lib/cookies";
// import { signUpSchema } from "@/lib/validators";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import z from "zod";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { name, email, password } = signUpSchema.parse(body);

//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       );
//     }

//     const userRole = await prisma.role.findUnique({ where: { name: "USER" } });
//     if (!userRole) {
//       return NextResponse.json(
//         { error: "USER role not found in the system" },
//         { status: 500 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         roles: {
//           create: [
//             {
//               role: {
//                 connect: {
//                   id: userRole.id,
//                 },
//               },
//             },
//           ],
//         },
//       },
//       include: {
//         roles: {
//           include: {
//             role: true,
//           },
//         },
//       },
//     });

//     const roleNames = user.roles.map((userRole) => userRole.role.name);

//     const JWT_SECRET = process.env.JWT_SECRET;
//     if (!JWT_SECRET) {
//       console.error("JWT_SECRET is not defined");
//       return NextResponse.json(
//         { error: "Server configuration error" },
//         { status: 500 }
//       );
//     }

//     const token = jwt.sign(
//       {
//         userId: user.id,
//         email: user.email,
//         roles: roleNames,
//       },
//       JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     await setAuthCookie(token);

//     return NextResponse.json(
//       {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         roles: roleNames,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: error.errors[0].message },
//         { status: 400 }
//       );
//     }
//     console.error("Failed to create user:", error);
//     return NextResponse.json(
//       { error: "Failed to create user" },
//       { status: 500 }
//     );
//   }
// }
