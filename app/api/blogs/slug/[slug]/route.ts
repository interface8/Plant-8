import { NextResponse } from "next/server";
import { BlogService } from "@/lib/services/blogService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blog = await BlogService.getBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Get related blogs
    const relatedBlogs = await BlogService.getRelatedBlogs(
      blog.id,
      blog.productId,
      blog.productTypeId,
      blog.tags
    );

    return NextResponse.json({ ...blog, relatedBlogs });
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
