import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { z } from "zod";

const locationSchema = z.object({
  name: z.string().min(1, "Location name is required").max(100, "Location name too long"),
  stateId: z.string().uuid("Invalid state ID"),
});

const updateLocationSchema = locationSchema.partial();

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      include: {
        state: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            lands: true,
          },
        },
      },
      orderBy: [
        { state: { name: "asc" } },
        { name: "asc" }
      ],
    });

    return NextResponse.json({ locations });
  } catch (error) {
    console.error("GET /api/admin/locations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = locationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, stateId } = parsed.data;

    // Check if state exists
    const state = await prisma.state.findUnique({ where: { id: stateId } });
    if (!state) {
      return NextResponse.json({ error: "State not found" }, { status: 404 });
    }

    // Check if location already exists in this state
    const existingLocation = await prisma.location.findFirst({
      where: { 
        name: { equals: name, mode: "insensitive" },
        stateId: stateId
      },
    });

    if (existingLocation) {
      return NextResponse.json(
        { error: "A location with this name already exists in this state" },
        { status: 409 }
      );
    }

    const location = await prisma.location.create({
      data: { 
        name, 
        stateId, 
        createdBy: session.user.id 
      },
      include: {
        state: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            lands: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Location created successfully", location },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating location:", error);
    return NextResponse.json(
      { error: "Failed to create location" },
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
    return NextResponse.json({ error: "Location ID required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = updateLocationSchema.safeParse(body);
    
    if (!parsed.success) {
      const errorMessage = parsed.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return NextResponse.json(
        { error: errorMessage || "Validation failed" },
        { status: 400 }
      );
    }

    // Check if location exists
    const existingLocation = await prisma.location.findUnique({ where: { id } });
    if (!existingLocation) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    // Check if new state exists (if stateId is being updated)
    if (parsed.data.stateId) {
      const state = await prisma.state.findUnique({
        where: { id: parsed.data.stateId },
      });
      if (!state) {
        return NextResponse.json({ error: "State not found" }, { status: 404 });
      }
    }

    // Check if name already exists in the target state (excluding current location)
    if (parsed.data.name || parsed.data.stateId) {
      const targetStateId = parsed.data.stateId || existingLocation.stateId;
      const targetName = parsed.data.name || existingLocation.name;
      
      const nameExists = await prisma.location.findFirst({
        where: { 
          name: { equals: targetName, mode: "insensitive" },
          stateId: targetStateId,
          NOT: { id }
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: "A location with this name already exists in this state" },
          { status: 409 }
        );
      }
    }

    const location = await prisma.location.update({
      where: { id },
      data: {
        ...parsed.data,
        modifiedBy: session.user.id,
        modifiedAt: new Date(),
      },
      include: {
        state: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            lands: true,
          },
        },
      },
    });

    return NextResponse.json({ location });
  } catch (error) {
    console.error("PUT /api/admin/locations error:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
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
    return NextResponse.json({ error: "Location ID required" }, { status: 400 });
  }

  try {
    // Check if location exists
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            lands: true,
          },
        },
      },
    });

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    // Check if location has lands
    if (location._count.lands > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete location. It has ${location._count.lands} land(s). Please delete or move the lands first.` 
        },
        { status: 409 }
      );
    }

    await prisma.location.delete({ where: { id } });

    return NextResponse.json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/locations error:", error);
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
}
