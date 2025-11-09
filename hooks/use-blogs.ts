"use client";

import { useState, useEffect } from "react";
import { Blog, BlogFilters, BlogListResponse } from "@/types/blog";

export function useBlogs(filters: BlogFilters = {}, page: number = 1, pageSize: number = 12) {
  const [data, setData] = useState<BlogListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("pageSize", pageSize.toString());
        
        if (filters.category) params.append("category", filters.category);
        if (filters.productId) params.append("productId", filters.productId);
        if (filters.productTypeId) params.append("productTypeId", filters.productTypeId);
        if (filters.search) params.append("search", filters.search);
        if (filters.status) params.append("status", filters.status);
        if (filters.authorId) params.append("authorId", filters.authorId);
        if (filters.tags && filters.tags.length > 0) {
          params.append("tags", filters.tags.join(","));
        }

        const response = await fetch(`/api/blogs?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [
    filters.category,
    filters.productId,
    filters.productTypeId,
    filters.search,
    filters.status,
    filters.authorId,
    filters.tags?.join(","),
    page,
    pageSize,
  ]);

  return { data, loading, error };
}

export function useBlog(slug: string) {
  const [blog, setBlog] = useState<(Blog & { relatedBlogs?: Blog[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/blogs/slug/${slug}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }

        const result = await response.json();
        setBlog(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  return { blog, loading, error };
}
