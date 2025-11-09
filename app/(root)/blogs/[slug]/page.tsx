import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogService } from "@/lib/services/blogService";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark } from "lucide-react";

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
    2
  );

  const coverImage = blog.coverImage || blog.product?.images?.[0]?.url || "/images/default-blog.jpg";

  const formatDate = (dateString: Date | null) => {
    if (!dateString) return "Recently";
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[400px] bg-muted">
        <img src={coverImage} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10 pb-16">
        {/* Back Button */}
        <Link href="/blogs">
          <Button
            variant="ghost"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </Link>

        {/* Article Card */}
        <Card className="mb-8">
          <CardContent className="p-8 md:p-12">
            {/* Category Badge */}
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              {blog.category}
            </Badge>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-6">{blog.title}</h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              {blog.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {blog.author.name}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(blog.publishedAt)}
              </div>
              {blog.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {blog.readTime} min read
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>

            <Separator className="mb-8" />

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="bg-accent/50 border-l-4 border-primary p-4 mb-8 rounded-r-lg">
                <p className="text-lg italic text-muted-foreground">{blog.excerpt}</p>
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:text-muted-foreground prose-ul:my-4
                prose-ol:text-muted-foreground prose-ol:my-4
                prose-li:my-2
                prose-blockquote:border-l-primary prose-blockquote:bg-accent/30 prose-blockquote:py-2
                prose-img:rounded-lg prose-img:shadow-md
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <Separator className="my-8" />

            {/* Tags */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedBlogs.map((relatedPost: any) => (
                <Link key={relatedPost.id} href={`/blogs/${relatedPost.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.coverImage || relatedPost.product?.images?.[0]?.url || "/images/default-blog.jpg"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/20">
                        {relatedPost.category}
                      </Badge>
                      <h4 className="text-lg font-semibold mb-2 line-clamp-2">{relatedPost.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {relatedPost.readTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {relatedPost.readTime} min
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
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
