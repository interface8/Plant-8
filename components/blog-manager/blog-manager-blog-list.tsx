"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Edit, Trash2, Eye, Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  approvalStatus: string;
  views: number;
  createdAt: Date;
  publishedAt: Date | null;
  rejectionReason: string | null;
  product?: { name: string } | null;
  productType?: { name: string } | null;
}

interface BlogManagerBlogListProps {
  blogs: Blog[];
}

export function BlogManagerBlogList({ blogs }: BlogManagerBlogListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    const loadingToast = toast.loading("Deleting blog...");

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Blog deleted successfully");
        router.refresh();
      } else {
        const error = await response.json();
        toast.dismiss(loadingToast);
        toast.error("Failed to delete blog", {
          description: error.error || "An error occurred",
        });
      }
    } catch (_error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to delete blog", {
        description: "Network error occurred",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      DRAFT: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft" },
      PUBLISHED: { bg: "bg-green-100", text: "text-green-700", label: "Published" },
      ARCHIVED: { bg: "bg-red-100", text: "text-red-700", label: "Archived" },
    };
    const badge = badges[status as keyof typeof badges] || badges.DRAFT;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getApprovalBadge = (approval: string) => {
    const badges = {
      PENDING: { 
        bg: "bg-yellow-100", 
        text: "text-yellow-700", 
        label: "Pending Approval",
        icon: Clock 
      },
      APPROVED: { 
        bg: "bg-green-100", 
        text: "text-green-700", 
        label: "Approved",
        icon: CheckCircle 
      },
      REJECTED: { 
        bg: "bg-red-100", 
        text: "text-red-700", 
        label: "Rejected",
        icon: XCircle 
      },
    };
    const badge = badges[approval as keyof typeof badges] || badges.PENDING;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${badge.bg} ${badge.text}`}>
        <Icon className="h-3 w-3" />
        {badge.label}
      </span>
    );
  };

  if (blogs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No blogs found</h3>
        <p className="text-gray-600 mb-6">
          You haven&apos;t created any blogs yet. Start by creating your first blog post.
        </p>
        <Link
          href="/blog-manager/blogs/new"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Your First Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex gap-6">
            {/* Cover Image */}
            {blog.coverImage && (
              <div className="flex-shrink-0">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                    {blog.title}
                  </h3>
                  {blog.excerpt && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {getStatusBadge(blog.status)}
                    {getApprovalBadge(blog.approvalStatus)}
                    {blog.product && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                        {blog.product.name}
                      </span>
                    )}
                    {blog.productType && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                        {blog.productType.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {blog.views} views
                    </span>
                    <span>
                      Created {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                    </span>
                    {blog.publishedAt && (
                      <span>
                        Published {formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  {blog.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{blog.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    href={`/blog-manager/blogs/edit/${blog.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(blog.id, blog.title)}
                    disabled={deletingId === blog.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
