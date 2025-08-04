import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { z } from "zod";

const landSchema = z.object({
  name: z.string().min(1, "Land name is required"),
  locationId: z.string().uuid("Invalid location ID"),
  gpsCoordinates: z.string().optional(),
  halfPlotPrice: z.number().positive("Half plot price must be positive"),
  fullPlotPrice: z.number().positive("Full plot price must be positive"),
  imageUrl: z.string().url("Invalid image URL").optional(),
  createdBy: z.string().uuid("Invalid user ID"),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await prisma.userRole.findFirst({
    where: { userId: session.user.id, role: { name: "Admin" } },
  });
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
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
      locationId,
      gpsCoordinates,
      halfPlotPrice,
      fullPlotPrice,
      imageUrl,
      createdBy,
    } = parsed.data;
    if (createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: Invalid creator ID" },
        { status: 403 }
      );
    }

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
        halfPlotPrice,
        fullPlotPrice,
        imageUrl,
        createdBy,
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
