import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId");

  if (!locationId) {
    return NextResponse.json(
      { error: "Location ID is required" },
      { status: 400 }
    );
  }

  try {
    const lands = await prisma.land.findMany({
      where: { locationId },
      select: {
        id: true,
        name: true,
        halfPlotPrice: true,
        fullPlotPrice: true,
        gpsCoordinates: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(lands, { status: 200 });
  } catch (error) {
    console.error("Error fetching lands:", error);
    return NextResponse.json(
      { error: "Failed to fetch lands" },
      { status: 500 }
    );
  }
}
