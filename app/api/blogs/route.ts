import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { BlogService } from "@/lib/services/blogService";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().default("General"),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().optional(),
  productId: z.string().optional(),
  productTypeId: z.string().optional(),
  authorId: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const category = searchParams.get("category") || undefined;
    const productId = searchParams.get("productId") || undefined;
    const productTypeId = searchParams.get("productTypeId") || undefined;
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED" || "PUBLISHED";
    const authorId = searchParams.get("authorId") || undefined;
    const tagsParam = searchParams.get("tags");
    const tags = tagsParam ? tagsParam.split(",") : undefined;

    const result = await BlogService.getBlogs(
      {
        category,
        productId,
        productTypeId,
        tags,
        search,
        status,
        authorId,
      },
      page,
      pageSize
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
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
    const validation = blogSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;
    
    // Generate slug if not provided
    const slug = data.slug || BlogService.generateSlug(data.title);
    
    // Calculate read time
    const readTime = BlogService.calculateReadTime(data.content);
    
    // Check if slug is unique
    const existingBlog = await BlogService.getBlogBySlug(slug);
    if (existingBlog) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 400 }
      );
    }

    // Determine approval status based on user role
    const isBlogManager = session.user.roles?.includes("BLOG_MANAGER");
    const isAdmin = session.user.roles?.includes("ADMIN");
    
    // Blog managers need approval, admins auto-approve
    const approvalStatus = isBlogManager && !isAdmin ? "PENDING" : "APPROVED";

    const blog = await BlogService.createBlog({
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt || null,
      coverImage: data.coverImage || null,
      category: data.category,
      tags: data.tags,
      status: data.status,
      approvalStatus,
      readTime,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.status === "PUBLISHED" ? new Date() : null,
      createdByUser: { connect: { id: session.user.id } },
      author: { connect: { id: session.user.id } },
      ...(data.productId && { product: { connect: { id: data.productId } } }),
      ...(data.productTypeId && { productType: { connect: { id: data.productTypeId } } }),
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
