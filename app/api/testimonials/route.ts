import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { auth } from "@/auth";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const adminView = searchParams.get("admin") === "true";

    // If admin is viewing, show all testimonials, otherwise show only approved
    const whereClause = adminView && session?.user?.roles?.includes("ADMIN")
      ? {} // No filter - show all
      : { isApproved: true }; // Show only approved

    const testimonies = await prisma.testimony.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        createdByUser: { select: { name: true } },
        modifiedByUser: { select: { name: true } },
      },
    });
    return NextResponse.json(testimonies);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch testimonies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Simple validation for user-submitted testimonials
    if (!body.content || typeof body.content !== "string" || body.content.trim().length < 20) {
      return NextResponse.json(
        { error: "Testimonial must be at least 20 characters long" },
        { status: 400 }
      );
    }

    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Get user info for the testimony
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });

    const testimony = await prisma.testimony.create({
      data: {
        investorName: user?.name || "Anonymous",
        comment: body.content.trim(),
        rating: body.rating,
        location: body.location || "Nigeria",
        isApproved: false, // Requires admin approval
        createdBy: session.user.id,
        modifiedBy: session.user.id,
      },
    });
    return NextResponse.json(testimony, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating testimony:", error);
    return NextResponse.json(
      { error: "Failed to create testimony" },
      { status: 500 }
    );
  }
}
