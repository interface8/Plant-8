import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { z } from "zod";

const rejectSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = rejectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Update blog approval status
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        approvalStatus: "REJECTED",
        approvedBy: session.user.id,
        approvedAt: new Date(),
        rejectionReason: validation.data.reason,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        product: true,
        productType: true,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Failed to reject blog:", error);
    return NextResponse.json(
      { error: "Failed to reject blog" },
      { status: 500 }
    );
  }
}
