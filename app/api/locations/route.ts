import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stateId = searchParams.get("stateId");

  try {
    const whereClause = stateId ? { stateId } : {};
    
    const locations = await prisma.location.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        stateId: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
