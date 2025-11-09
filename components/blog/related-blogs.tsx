import { Blog } from "@/types/blog";
import BlogCard from "./blog-card";

interface RelatedBlogsProps {
  blogs: Blog[];
  title?: string;
}

export default function RelatedBlogs({ blogs, title = "Related Articles" }: RelatedBlogsProps) {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        <div className="mt-2 h-1 w-20 bg-green-600 rounded"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
