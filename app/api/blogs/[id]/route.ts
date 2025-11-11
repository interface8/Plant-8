import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { BlogService } from "@/lib/services/blogService";
import { z } from "zod";

const blogUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  publishedAt: z.string().optional(),
  productId: z.string().optional(),
  productTypeId: z.string().optional(),
  authorId: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await BlogService.getBlogById(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const validation = blogUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check if blog exists
    const existingBlog = await BlogService.getBlogById(id);
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // If slug is being updated, check uniqueness
    if (data.slug && data.slug !== existingBlog.slug) {
      const blogWithSlug = await BlogService.getBlogBySlug(data.slug);
      if (blogWithSlug) {
        return NextResponse.json(
          { error: "A blog with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Calculate read time if content is updated
    const readTime = data.content
      ? BlogService.calculateReadTime(data.content)
      : undefined;

    const updateData: any = {
      ...data,
      ...(readTime && { readTime }),
      ...(data.publishedAt && { publishedAt: new Date(data.publishedAt) }),
      modifiedBy: session.user.id,
      modifiedAt: new Date(),
    };

    // Handle relations
    if (data.authorId !== undefined) {
      updateData.author = data.authorId ? { connect: { id: data.authorId } } : { disconnect: true };
    }
    if (data.productId !== undefined) {
      updateData.product = data.productId ? { connect: { id: data.productId } } : { disconnect: true };
    }
    if (data.productTypeId !== undefined) {
      updateData.productType = data.productTypeId ? { connect: { id: data.productTypeId } } : { disconnect: true };
    }

    const blog = await BlogService.updateBlog(id, updateData);

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Failed to update blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const existingBlog = await BlogService.getBlogById(id);
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await BlogService.deleteBlog(id);

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
