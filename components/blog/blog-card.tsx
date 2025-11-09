import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/types/blog";
import { formatDistanceToNow } from "date-fns";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const coverImage = blog.coverImage || blog.product?.images?.[0]?.url || "/images/default-blog.jpg";
  const publishedDate = blog.publishedAt
    ? formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true })
    : "Draft";

  return (
    <Link href={`/blogs/${blog.slug}`} className="group block">
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <Image
            src={coverImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {blog.category}
          </div>
          {blog.readTime && (
            <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
              {blog.readTime} min read
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            {blog.author && (
              <>
                {blog.author.image && (
                  <Image
                    src={blog.author.image}
                    alt={blog.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span>{blog.author.name}</span>
                <span>•</span>
              </>
            )}
            <time>{publishedDate}</time>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>

          {blog.excerpt && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
              {blog.excerpt}
            </p>
          )}

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {blog.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {blog.product && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-600 font-medium">Related to:</span>
                <span>{blog.product.name}</span>
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
