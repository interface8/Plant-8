import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BlogManagerSidebar } from "@/components/blog-manager/blog-manager-sidebar";

export const metadata = {
  title: "Blog Manager | FAM 8",
  description: "Manage your blog content",
};

export default async function BlogManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user) {
    redirect("/sign-in?from=/blog-manager");
  }

  // Check if user has BLOG_MANAGER role
  const hasBlogManagerRole = session.user.roles?.includes("BLOG_MANAGER");
  const hasAdminRole = session.user.roles?.includes("ADMIN");

  if (!hasBlogManagerRole && !hasAdminRole) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <BlogManagerSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
