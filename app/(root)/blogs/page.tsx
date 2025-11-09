"use client";

import { useState } from "react";
import { useBlogs } from "@/hooks/use-blogs";
import BlogCard from "@/components/blog/blog-card";
import BlogFilter from "@/components/blog/blog-filter";

export default function BlogsPage() {
  const [category, setCategory] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, loading, error } = useBlogs(
    { category, tags, search, status: "PUBLISHED" },
    page,
    12
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Agribid Blog
          </h1>
          <p className="text-lg sm:text-xl text-green-50 max-w-3xl">
            Explore insights, tips, and stories from the world of agricultural
            investment
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {data && (
              <BlogFilter
                categories={data.categories}
                popularTags={data.popularTags}
                selectedCategory={category}
                selectedTags={tags}
                searchQuery={search}
                onCategoryChange={setCategory}
                onTagsChange={setTags}
                onSearchChange={setSearch}
              />
            )}
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading blogs...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {data && !loading && (
              <>
                {/* Results Summary */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing <span className="font-semibold">{data.blogs.length}</span> of{" "}
                    <span className="font-semibold">{data.total}</span> articles
                  </p>
                </div>

                {/* Blog Grid */}
                {data.blogs.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                      {data.blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {data.totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-4 py-2 rounded-lg ${
                              page === p
                                ? "bg-green-600 text-white"
                                : "border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        ))}

                        <button
                          onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                          disabled={page === data.totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-600 text-lg mb-4">No blogs found matching your filters</p>
                    <button
                      onClick={() => {
                        setCategory(undefined);
                        setTags([]);
                        setSearch("");
                      }}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
