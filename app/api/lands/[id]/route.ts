import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const land = await prisma.land.findUnique({
      where: { id: (await params).id },
      select: {
        id: true,
        name: true,
        halfPlotPrice: true,
        fullPlotPrice: true,
        gpsCoordinates: true,
        imageUrl: true,
        farmerDailyWage: true,
        location: {
          select: {
            id: true,
            name: true,
            state: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!land) {
      return NextResponse.json({ error: "Land not found" }, { status: 404 });
    }
    return NextResponse.json(land, { status: 200 });
  } catch (error) {
    console.error("Error fetching land:", error);
    return NextResponse.json(
      { error: "Failed to fetch land" },
      { status: 500 }
    );
  }
}
