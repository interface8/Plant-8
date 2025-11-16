"use client";

import { useState } from "react";
import { useBlogs } from "@/hooks/use-blogs";
import { useRouter } from "next/navigation";
import { Blog } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const categories = ["All", "Investment Tips", "Farming Guide", "Market Insights", "Sustainability", "Product", "Technology"];

  const { data, loading, error } = useBlogs(
    { 
      category: selectedCategory === "All" ? undefined : selectedCategory,
      status: "PUBLISHED" 
    },
    page,
    12
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "Recently";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handlePostClick = (blog: Blog) => {
    router.push(`/blogs/${blog.slug}`);
  };

  const filteredPosts = data?.blogs || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">FAM 8 Insights</h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Expert insights, farming guides, and success stories to help you make informed
            investment decisions in agriculture.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-accent"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading articles...</p>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Featured Post (First Post) */}
          {filteredPosts.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handlePostClick(filteredPosts[0])}>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-video lg:aspect-auto relative">
                    <Image
                      src={filteredPosts[0].coverImage || filteredPosts[0].product?.images?.[0]?.url || "/images/default-blog.jpg"}
                      alt={filteredPosts[0].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <Badge className="w-fit mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                      Featured
                    </Badge>
                    <h2 className="text-2xl font-bold mb-4">{filteredPosts[0].title}</h2>
                    <p className="text-muted-foreground mb-6">{filteredPosts[0].excerpt}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                      {filteredPosts[0].author && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {filteredPosts[0].author.name}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(filteredPosts[0].publishedAt)}
                      </div>
                      {filteredPosts[0].readTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {filteredPosts[0].readTime} min read
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {filteredPosts[0].tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-fit">
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </div>
          )}

          {/* Blog Posts Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h3 className="text-2xl font-bold mb-6">
              {selectedCategory === "All" ? "All Articles" : selectedCategory}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.slice(1).map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="aspect-video overflow-hidden relative">
                    <Image
                      src={post.coverImage || post.product?.images?.[0]?.url || "/images/default-blog.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/20">
                      {post.category}
                    </Badge>
                    <h4 className="text-lg font-semibold mb-3 line-clamp-2">{post.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                      {post.author && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author.name}
                        </div>
                      )}
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime} min
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found in this category.</p>
              </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
