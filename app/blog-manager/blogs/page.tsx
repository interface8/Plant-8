import { auth } from "@/auth";
import prisma from "@/db/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { BlogManagerBlogList } from "@/components/blog-manager/blog-manager-blog-list";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    approval?: string;
    search?: string;
  }>;
}

export default async function BlogManagerBlogsPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const params = await searchParams;

  // Build filter conditions
  const where: any = {
    authorId: session.user.id,
  };

  if (params.status) {
    where.status = params.status;
  }

  if (params.approval) {
    where.approvalStatus = params.approval;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { excerpt: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  // Fetch blogs for this user
  const blogs = await prisma.blog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: { name: true },
      },
      productType: {
        select: { name: true },
      },
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">My Blogs</h1>
          <p className="text-green-700">Create, edit, and manage your blog posts.</p>
        </div>

        <Link
          href="/blog-manager/blogs/new"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Blog
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/blog-manager/blogs"
            className={`px-4 py-2 rounded-lg transition-colors ${
              !params.status && !params.approval
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Blogs
          </Link>
          <Link
            href="/blog-manager/blogs?status=DRAFT"
            className={`px-4 py-2 rounded-lg transition-colors ${
              params.status === 'DRAFT'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Drafts
          </Link>
          <Link
            href="/blog-manager/blogs?approval=PENDING"
            className={`px-4 py-2 rounded-lg transition-colors ${
              params.approval === 'PENDING'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending Approval
          </Link>
          <Link
            href="/blog-manager/blogs?approval=APPROVED"
            className={`px-4 py-2 rounded-lg transition-colors ${
              params.approval === 'APPROVED'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </Link>
          <Link
            href="/blog-manager/blogs?approval=REJECTED"
            className={`px-4 py-2 rounded-lg transition-colors ${
              params.approval === 'REJECTED'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected
          </Link>
        </div>
      </div>

      {/* Blog List */}
      <BlogManagerBlogList blogs={blogs} />
    </div>
  );
}
