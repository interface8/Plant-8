import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { z } from "zod";

const landSchema = z.object({
  name: z.string().min(1, "Land name is required"),
  locationId: z.string().uuid("Invalid location ID"),
  gpsCoordinates: z.string().nullable().optional(),
  dailyPrice: z.number().positive("Daily price must be positive"),
  imageUrl: z.string().url("Invalid image URL").nullable().optional(),
  createdBy: z.string().uuid("Invalid user ID").optional(),
  fertilizerCostPerPlot: z.number().min(0, "Fertilizer cost per plot must be non-negative"),
  inspectionDailyFee: z.number().min(0, "Inspection daily fee must be non-negative"),
  inflationRate: z.number().min(0, "Inflation rate must be non-negative"),
});

const updateLandSchema = landSchema.partial();

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = landSchema.safeParse(body);
    if (!parsed.success) {
      const errorMessage = parsed.error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      return NextResponse.json(
        { error: errorMessage || "Validation failed" },
        { status: 400 }
      );
    }

    const {
      name,
      locationId,
      gpsCoordinates,
      dailyPrice,
      imageUrl,
      createdBy,
      fertilizerCostPerPlot,
      inspectionDailyFee,
      inflationRate,
    } = parsed.data;

    // Use the session user ID if createdBy is not provided
    const finalCreatedBy = createdBy || session.user.id;

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
        name,
        locationId,
        gpsCoordinates,
        dailyPrice,
        imageUrl,
        createdBy: finalCreatedBy,
        fertilizerCostPerPlot,
        inspectionDailyFee,
        inflationRate,
      },
    });

    return NextResponse.json(
      { message: "Land created successfully", land },
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

export async function GET() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lands = await prisma.land.findMany({
      include: {
        location: {
          select: {
            id: true,
            name: true,
            state: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
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

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Land ID required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const parsed = updateLandSchema.safeParse(body);
    if (!parsed.success) {
      const errorMessage = parsed.error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      return NextResponse.json(
        { error: errorMessage || "Validation failed" },
        { status: 400 }
      );
    }

    const existingLand = await prisma.land.findUnique({ where: { id } });
    if (!existingLand) {
      return NextResponse.json(
        { error: "Land not found" },
        { status: 404 }
      );
    }

    // If locationId is being updated, verify it exists
    if (parsed.data.locationId) {
      const location = await prisma.location.findUnique({
        where: { id: parsed.data.locationId },
      });
      if (!location) {
        return NextResponse.json(
          { error: "Location not found" },
          { status: 404 }
        );
      }
    }

    const land = await prisma.land.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(
      {
        message: "Land updated successfully",
        land,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating land:", error);
    return NextResponse.json(
      { error: "Failed to update land" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Land ID required" },
      { status: 400 }
    );
  }

  try {
    const existingLand = await prisma.land.findUnique({ where: { id } });
    if (!existingLand) {
      return NextResponse.json(
        { error: "Land not found" },
        { status: 404 }
      );
    }

    // Check if land has any investments before deleting
    const investments = await prisma.investment.findMany({
      where: { landId: id },
    });

    if (investments.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete land with existing investments" },
        { status: 400 }
      );
    }

    await prisma.land.delete({ where: { id } });

    return NextResponse.json(
      { message: "Land deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting land:", error);
    return NextResponse.json(
      { error: "Failed to delete land" },
      { status: 500 }
    );
  }
}
