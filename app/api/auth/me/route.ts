import { NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/cookies";
import jwt from "jsonwebtoken";
import prisma from "@/db/prisma";

export async function GET() {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token" },
        { status: 401 }
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        roles: string[];
      };

      // Verify user still exists in database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }

      const roleNames = user.roles.map((userRole) => userRole.role.name);

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: roleNames,
        },
      });
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
