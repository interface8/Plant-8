import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

// Define type for user with roles to avoid implicit 'any'
// type UserWithRoles = {
//   id: string;
//   name: string | null;
//   email: string | null;
//   createdAt: Date;
//   roles: { name: string }[];
// };

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        roles: { select: { name: true } },
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...user,
      roles: user.roles.map((r: { name: string }) => r.name),
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, email } = body;
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        roles: { select: { name: true } },
      },
    });
    return NextResponse.json({
      ...user,
      roles: user.roles.map((r: { name: string }) => r.name),
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// import { prisma } from "@/db/prisma";
// import { NextResponse } from "next/server";

// // GET /api/users/:id
// export async function GET(_: Request, { params }: { params: { id: string } }) {
//   const user = await prisma.user.findUnique({
//     where: { id: params.id },
//     include: { roles: { include: { role: true } } },
//   });

//   if (!user) return new NextResponse("User not found", { status: 404 });
//   return NextResponse.json(user);
// }

// // PUT /api/users/:id
// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const body = await req.json();

//   const updated = await prisma.user.update({
//     where: { id: params.id },
//     data: {
//       name: body.name,
//       email: body.email,
//     },
//   });

//   return NextResponse.json(updated);
// }

// // DELETE /api/users/:id
// export async function DELETE(
//   _: Request,
//   { params }: { params: { id: string } }
// ) {
//   await prisma.user.delete({ where: { id: params.id } });
//   return new NextResponse(null, { status: 204 });
// }
