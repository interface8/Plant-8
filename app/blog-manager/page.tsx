import { auth } from "@/auth";
import prisma from "@/db/prisma";
import Link from "next/link";
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function BlogManagerDashboard() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  // Get blog statistics for this user
  const [totalBlogs, draftBlogs, pendingBlogs, approvedBlogs, rejectedBlogs] = await Promise.all([
    prisma.blog.count({
      where: { authorId: session.user.id },
    }),
    prisma.blog.count({
      where: { authorId: session.user.id, status: "DRAFT" },
    }),
    prisma.blog.count({
      where: { authorId: session.user.id, approvalStatus: "PENDING" },
    }),
    prisma.blog.count({
      where: { authorId: session.user.id, approvalStatus: "APPROVED" },
    }),
    prisma.blog.count({
      where: { authorId: session.user.id, approvalStatus: "REJECTED" },
    }),
  ]);

  const stats = [
    {
      title: "Total Blogs",
      value: totalBlogs,
      icon: FileText,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Drafts",
      value: draftBlogs,
      icon: Clock,
      color: "bg-gray-500",
      textColor: "text-gray-600",
    },
    {
      title: "Pending Approval",
      value: pendingBlogs,
      icon: Clock,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
    {
      title: "Approved",
      value: approvedBlogs,
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Rejected",
      value: rejectedBlogs,
      icon: XCircle,
      color: "bg-red-500",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-green-700">Manage your blog content from here.</p>
        </div>

        <Link
          href="/blog-manager/blogs/new"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Blog
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/blog-manager/blogs/new"
            className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <Plus className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-gray-800">Create New Blog</p>
              <p className="text-sm text-gray-600">Start writing a new post</p>
            </div>
          </Link>

          <Link
            href="/blog-manager/blogs?status=DRAFT"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Clock className="h-8 w-8 text-gray-600" />
            <div>
              <p className="font-medium text-gray-800">View Drafts</p>
              <p className="text-sm text-gray-600">Continue your work</p>
            </div>
          </Link>

          <Link
            href="/blog-manager/blogs?approval=PENDING"
            className="flex items-center gap-3 p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
          >
            <Clock className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="font-medium text-gray-800">Pending Approval</p>
              <p className="text-sm text-gray-600">Check submission status</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          About Blog Approval Workflow
        </h3>
        <p className="text-blue-800">
          All blog posts you create will go through an approval process. Draft posts can be edited freely.
          Once you submit a post for approval, an administrator will review it. Approved posts will be published
          to the public blog, while rejected posts can be revised and resubmitted.
        </p>
      </div>
    </div>
  );
}
