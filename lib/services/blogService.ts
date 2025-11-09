import prisma from "@/db/prisma";
import { BlogFilters, Blog } from "@/types/blog";
import { Prisma } from "@prisma/client";

export class BlogService {
  static async getBlogs(
    filters: BlogFilters = {},
    page: number = 1,
    pageSize: number = 12
  ): Promise<{
    blogs: Blog[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    categories: string[];
    popularTags: string[];
  }> {
    const {
      category,
      productId,
      productTypeId,
      tags,
      search,
      status = "PUBLISHED",
      authorId,
    } = filters;

    const where: Prisma.BlogWhereInput = {
      status,
      ...(category && { category }),
      ...(productId && { productId }),
      ...(productTypeId && { productTypeId }),
      ...(authorId && { authorId }),
      ...(tags && tags.length > 0 && {
        tags: {
          hasSome: tags,
        },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { excerpt: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [blogs, total, categories, allTags] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: { select: { url: true }, take: 1 },
            },
          },
          productType: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where: { status: "PUBLISHED" },
        select: { category: true },
        distinct: ["category"],
      }),
      prisma.blog.findMany({
        where: { status: "PUBLISHED" },
        select: { tags: true },
      }),
    ]);

    // Extract unique categories
    const uniqueCategories = categories.map((c) => c.category);

    // Extract and count tags
    const tagCounts = new Map<string, number>();
    allTags.forEach((blog) => {
      blog.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    const popularTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([tag]) => tag);

    return {
      blogs: blogs as Blog[],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      categories: uniqueCategories,
      popularTags,
    };
  }

  static async getBlogBySlug(slug: string): Promise<Blog | null> {
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            images: { select: { url: true } },
          },
        },
        productType: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (blog) {
      // Increment view count
      await prisma.blog.update({
        where: { id: blog.id },
        data: { views: { increment: 1 } },
      });
    }

    return blog as Blog | null;
  }

  static async getBlogById(id: string): Promise<Blog | null> {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            images: { select: { url: true } },
          },
        },
        productType: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    return blog as Blog | null;
  }

  static async getRelatedBlogs(
    blogId: string,
    productId?: string | null,
    productTypeId?: string | null,
    tags?: string[],
    limit: number = 3
  ): Promise<Blog[]> {
    const where: Prisma.BlogWhereInput = {
      id: { not: blogId },
      status: "PUBLISHED",
      OR: [
        ...(productId ? [{ productId }] : []),
        ...(productTypeId ? [{ productTypeId }] : []),
        ...(tags && tags.length > 0
          ? [{ tags: { hasSome: tags } }]
          : []),
      ],
    };

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            images: { select: { url: true }, take: 1 },
          },
        },
      },
      orderBy: { views: "desc" },
      take: limit,
    });

    return blogs as Blog[];
  }

  static async createBlog(data: Prisma.BlogCreateInput) {
    return prisma.blog.create({
      data,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: { select: { url: true } },
          },
        },
        productType: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  static async updateBlog(id: string, data: Prisma.BlogUpdateInput) {
    return prisma.blog.update({
      where: { id },
      data,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: { select: { url: true } },
          },
        },
        productType: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  static async deleteBlog(id: string) {
    return prisma.blog.delete({
      where: { id },
    });
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  }

  static calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
