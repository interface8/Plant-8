import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET() {
  try {
    const addressTypes = await prisma.addressType.findMany();
    return NextResponse.json(
      addressTypes.map((type) => ({
        id: type.id,
        name: type.name,
      }))
    );
  } catch (error) {
    console.error("GET address types error:", error);
    return NextResponse.json(
      { error: "Failed to fetch address types" },
      { status: 500 }
    );
  }
}
