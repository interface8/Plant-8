import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import InvestmentsTable from "@/components/admin/investments/investments-table";
import InvestmentsStats from "@/components/admin/investments/investments-stats";
import InvestmentsFilters from "@/components/admin/investments/investments-filters";

interface AdminInvestmentsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    minAmount?: string;
    maxAmount?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function AdminInvestmentsPage({ searchParams }: AdminInvestmentsPageProps) {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "10");
  const skip = (page - 1) * limit;

  // Build where clause
  const whereConditions: Record<string, unknown>[] = [];
  
  if (params.status) {
    whereConditions.push({ status: params.status });
  }
  
  if (params.minAmount) {
    whereConditions.push({ amount: { gte: parseFloat(params.minAmount) } });
  }
  
  if (params.maxAmount) {
    whereConditions.push({ amount: { lte: parseFloat(params.maxAmount) } });
  }
  
  if (params.dateFrom) {
    whereConditions.push({ createdAt: { gte: new Date(params.dateFrom) } });
  }
  
  if (params.dateTo) {
    whereConditions.push({ createdAt: { lte: new Date(params.dateTo) } });
  }
  
  if (params.search) {
    whereConditions.push({
      OR: [
        { user: { name: { contains: params.search, mode: "insensitive" } } },
        { user: { email: { contains: params.search, mode: "insensitive" } } },
        { product: { name: { contains: params.search, mode: "insensitive" } } },
        { productType: { name: { contains: params.search, mode: "insensitive" } } },
      ]
    });
  }

  const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

  // Build order clause
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = (params.sortOrder || "desc") as "asc" | "desc";
  let orderBy = {};
  
  if (sortBy === "userName") {
    orderBy = { user: { name: sortOrder } };
  } else if (sortBy === "productName") {
    orderBy = { product: { name: sortOrder } };
  } else {
    orderBy = { [sortBy]: sortOrder };
  }

  const [investments, totalCount, stats] = await Promise.all([
    prisma.investment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            images: { select: { url: true } },
          },
        },
        productType: {
          select: {
            id: true,
            name: true,
          },
        },
        land: {
          select: {
            id: true,
            name: true,
            location: {
              select: {
                name: true,
                state: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.investment.count({ where }),
    // Get summary statistics
    prisma.investment.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { amount: true },
      _avg: { progress: true },
    }),
  ]);

  const statsFormatted = stats.reduce((acc, stat) => {
    acc[stat.status] = {
      count: stat._count._all,
      totalAmount: stat._sum.amount || 0,
      averageProgress: stat._avg.progress || 0,
    };
    return acc;
  }, {} as Record<string, { count: number; totalAmount: number; averageProgress: number }>);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Management</h1>
          <p className="text-gray-600">Monitor and manage all user investments with advanced filtering and analytics.</p>
        </div>
      </div>
      
      <InvestmentsStats stats={statsFormatted} />
      
      <InvestmentsFilters 
        currentFilters={params}
      />
      
      <InvestmentsTable 
        investments={investments.map(inv => ({
          ...inv,
          createdAt: inv.createdAt.toISOString(),
          product: {
            ...inv.product,
            images: Array.isArray(inv.product.images) ? inv.product.images.map((img: { url: string }) => img.url) : [],
          },
        }))}
        pagination={{
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        }}
        currentSort={{
          sortBy,
          sortOrder,
        }}
      />
    </div>
  );
}