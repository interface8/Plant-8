import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { landSchema } from "@/lib/validators/land-schema-validators";
import { auth } from "@/auth";

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

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !session?.user?.roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = landSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      name,
      gpsCoordinates,
      halfPlotPrice,
      fullPlotPrice,
      imageUrl,
      locationId,
    } = parsed.data;

    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    const land = await prisma.land.create({
      data: {
        id: crypto.randomUUID(),
        name,
        gpsCoordinates,
        halfPlotPrice,
        fullPlotPrice,
        imageUrl: imageUrl || null,
        locationId,
      },
      select: {
        id: true,
        name: true,
        gpsCoordinates: true,
        halfPlotPrice: true,
        fullPlotPrice: true,
        imageUrl: true,
        location: { select: { name: true, state: { select: { name: true } } } },
      },
    });

    return NextResponse.json(
      {
        message: "Land created successfully",
        land: {
          id: land.id,
          name: land.name,
          location: `${land.location.name}, ${land.location.state.name}`,
          halfPlotPrice: land.halfPlotPrice,
          fullPlotPrice: land.fullPlotPrice,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating land:", error);
    return NextResponse.json(
      { error: "Failed to create land" },
      { status: 500 }
    );
  }
}
