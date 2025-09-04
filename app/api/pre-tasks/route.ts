import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { z } from "zod";

// Zod schema for PreTask validation
const preTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  estimatedCompletionDate: z.date().optional(),
  productId: z.string().uuid("Invalid product ID"),
});

const updatePreTaskSchema = preTaskSchema.partial();

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  try {
    const where = productId ? { productId } : {};
    const preTasks = await prisma.preTask.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(preTasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching pre-tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch pre-tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = preTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { title, description, estimatedCompletionDate, productId } =
      parsed.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const preTask = await prisma.preTask.create({
      data: {
        title,
        description,
        estimatedCompletionDate,
        productId,
      },
    });

    return NextResponse.json(
      {
        message: "Pre-task created successfully",
        preTask,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating pre-task:", error);
    return NextResponse.json(
      { error: "Failed to create pre-task" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Pre-task ID required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const parsed = updatePreTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const existingPreTask = await prisma.preTask.findUnique({ where: { id } });
    if (!existingPreTask) {
      return NextResponse.json(
        { error: "Pre-task not found" },
        { status: 404 }
      );
    }

    const preTask = await prisma.preTask.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(
      {
        message: "Pre-task updated successfully",
        preTask,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating pre-task:", error);
    return NextResponse.json(
      { error: "Failed to update pre-task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Pre-task ID required" },
      { status: 400 }
    );
  }

  try {
    const existingPreTask = await prisma.preTask.findUnique({ where: { id } });
    if (!existingPreTask) {
      return NextResponse.json(
        { error: "Pre-task not found" },
        { status: 404 }
      );
    }

    await prisma.preTask.delete({ where: { id } });

    return NextResponse.json(
      { message: "Pre-task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting pre-task:", error);
    return NextResponse.json(
      { error: "Failed to delete pre-task" },
      { status: 500 }
    );
  }
}
