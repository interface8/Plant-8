export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  views: number;
  readTime: number | null;
  publishedAt: Date | null;
  productId: string | null;
  productTypeId: string | null;
  authorId: string | null;
  createdAt: Date;
  createdBy: string | null;
  modifiedAt: Date | null;
  modifiedBy: string | null;
  
  // Relations
  product?: {
    id: string;
    name: string;
    images: { url: string }[];
  };
  productType?: {
    id: string;
    name: string;
    description: string;
  };
  author?: {
    id: string;
    name: string;
    image: string | null;
  };
}

export interface BlogFormData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  readTime?: number;
  publishedAt?: Date | null;
  productId?: string | null;
  productTypeId?: string | null;
  authorId?: string | null;
}

export interface BlogFilters {
  category?: string;
  productId?: string;
  productTypeId?: string;
  tags?: string[];
  search?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  authorId?: string;
}

export interface BlogListResponse {
  blogs: Blog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  categories: string[];
  popularTags: string[];
}

export const BLOG_CATEGORIES = [
  "General",
  "Product",
  "Category",
  "Investment Tips",
  "Farming Guide",
  "Market Insights",
  "Success Stories",
  "Sustainability",
  "Technology",
  "News",
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];
