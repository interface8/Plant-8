import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";

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
        approvalStatus: "APPROVED",
        approvedBy: session.user.id,
        approvedAt: new Date(),
        rejectionReason: null,
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
    console.error("Failed to approve blog:", error);
    return NextResponse.json(
      { error: "Failed to approve blog" },
      { status: 500 }
    );
  }
}
