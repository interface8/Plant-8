import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { z } from "zod";

const stateSchema = z.object({
  name: z.string().min(1, "State name is required").max(100, "State name too long"),
});

const updateStateSchema = stateSchema.partial();

export async function GET() {
  try {
    const states = await prisma.state.findMany({
      include: {
        locations: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            locations: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ states });
  } catch (error) {
    console.error("GET /api/admin/states error:", error);
    return NextResponse.json(
      { error: "Failed to fetch states" },
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
    const parsed = stateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name } = parsed.data;

    // Check if state already exists
    const existingState = await prisma.state.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existingState) {
      return NextResponse.json(
        { error: "A state with this name already exists" },
        { status: 409 }
      );
    }

    const state = await prisma.state.create({
      data: { 
        name, 
        createdBy: session.user.id 
      },
      include: {
        _count: {
          select: {
            locations: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "State created successfully", state },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating state:", error);
    return NextResponse.json(
      { error: "Failed to create state" },
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
    return NextResponse.json({ error: "State ID required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = updateStateSchema.safeParse(body);
    
    if (!parsed.success) {
      const errorMessage = parsed.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return NextResponse.json(
        { error: errorMessage || "Validation failed" },
        { status: 400 }
      );
    }

    // Check if state exists
    const existingState = await prisma.state.findUnique({ where: { id } });
    if (!existingState) {
      return NextResponse.json({ error: "State not found" }, { status: 404 });
    }

    // Check if name already exists (excluding current state)
    if (parsed.data.name) {
      const nameExists = await prisma.state.findFirst({
        where: { 
          name: { equals: parsed.data.name, mode: "insensitive" },
          NOT: { id }
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: "A state with this name already exists" },
          { status: 409 }
        );
      }
    }

    const state = await prisma.state.update({
      where: { id },
      data: {
        ...parsed.data,
        modifiedBy: session.user.id,
        modifiedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            locations: true,
          },
        },
      },
    });

    return NextResponse.json({ state });
  } catch (error) {
    console.error("PUT /api/admin/states error:", error);
    return NextResponse.json(
      { error: "Failed to update state" },
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
    return NextResponse.json({ error: "State ID required" }, { status: 400 });
  }

  try {
    // Check if state exists
    const state = await prisma.state.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            locations: true,
          },
        },
      },
    });

    if (!state) {
      return NextResponse.json({ error: "State not found" }, { status: 404 });
    }

    // Check if state has locations
    if (state._count.locations > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete state. It has ${state._count.locations} location(s). Please delete or move the locations first.` 
        },
        { status: 409 }
      );
    }

    await prisma.state.delete({ where: { id } });

    return NextResponse.json({ message: "State deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/states error:", error);
    return NextResponse.json(
      { error: "Failed to delete state" },
      { status: 500 }
    );
  }
}
