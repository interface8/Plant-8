import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const duration = await prisma.duration.findUnique({
      where: { id: (await params).id },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    if (!duration) {
      return NextResponse.json({ error: "Duration not found" }, { status: 404 });
    }
    return NextResponse.json(duration, { status: 200 });
  } catch (error) {
    console.error("Error fetching duration:", error);
    return NextResponse.json(
      { error: "Failed to fetch duration" },
      { status: 500 }
    );
  }
}
