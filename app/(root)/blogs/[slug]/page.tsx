import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BlogService } from "@/lib/services/blogService";
import { format } from "date-fns";
import RelatedBlogs from "@/components/blog/related-blogs";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await BlogService.getBlogBySlug(slug);

  if (!blog || blog.status !== "PUBLISHED") {
    notFound();
  }

  // Get related blogs
  const relatedBlogs = await BlogService.getRelatedBlogs(
    blog.id,
    blog.productId,
    blog.productTypeId,
    blog.tags,
    3
  );

  const coverImage = blog.coverImage || blog.product?.images?.[0]?.url || "/images/default-blog.jpg";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] sm:h-[500px] bg-black">
        <Image
          src={coverImage}
          alt={blog.title}
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          <div className="max-w-4xl">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {blog.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              {blog.author && (
                <div className="flex items-center gap-2">
                  {blog.author.image && (
                    <Image
                      src={blog.author.image}
                      alt={blog.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <span className="font-medium">{blog.author.name}</span>
                </div>
              )}
              {blog.publishedAt && (
                <>
                  <span>•</span>
                  <time>{format(new Date(blog.publishedAt), "MMMM d, yyyy")}</time>
                </>
              )}
              {blog.readTime && (
                <>
                  <span>•</span>
                  <span>{blog.readTime} min read</span>
                </>
              )}
              <span>•</span>
              <span>{blog.views} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          {blog.excerpt && (
            <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8 rounded-r-lg">
              <p className="text-lg text-gray-700 italic">{blog.excerpt}</p>
            </div>
          )}

          {/* Related Product/Category */}
          {(blog.product || blog.productType) && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">RELATED TO</h3>
              {blog.product && (
                <Link
                  href={`/investments/product/${blog.product.id}`}
                  className="flex items-center gap-4 group"
                >
                  {blog.product.images && blog.product.images[0] && (
                    <Image
                      src={blog.product.images[0].url}
                      alt={blog.product.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {blog.product.name}
                    </p>
                    <p className="text-sm text-green-600">View product →</p>
                  </div>
                </Link>
              )}
              {blog.productType && !blog.product && (
                <Link
                  href={`/investments/category/${blog.productType.name}`}
                  className="group"
                >
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {blog.productType.name}
                  </p>
                  <p className="text-sm text-green-600">View category →</p>
                </Link>
              )}
            </div>
          )}

          {/* Main Content */}
          <article className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8">
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900
                prose-ul:text-gray-700
                prose-ol:text-gray-700
                prose-blockquote:border-l-green-600 prose-blockquote:bg-green-50 prose-blockquote:py-2
                prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blogs?tags=${tag}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-100 hover:text-green-700 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">SHARE THIS ARTICLE</h3>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Facebook
              </button>
              <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                Twitter
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                WhatsApp
              </button>
            </div>
          </div>

          {/* Related Blogs */}
          {relatedBlogs && relatedBlogs.length > 0 && (
            <RelatedBlogs blogs={relatedBlogs} />
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await BlogService.getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt || blog.title,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}
