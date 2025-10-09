import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { InvestmentAnalytics } from "@/components/admin/investments";

export default async function InvestmentAnalyticsPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("ADMIN")) {
    redirect("/unauthorized");
  }

  // Fetch analytics data
  const [
    totalStats,
    statusBreakdown,
    monthlyTrends,
    topProducts,
    userDistribution,
    revenueByProduct,
    completionRates
  ] = await Promise.all([
    // Total investment statistics
    prisma.investment.aggregate({
      _sum: { amount: true, expectedReturn: true },
      _avg: { amount: true, progress: true, numberOfPlots: true },
      _count: { _all: true }
    }),

    // Investment status breakdown
    prisma.investment.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { amount: true },
      _avg: { progress: true }
    }),

    // Monthly investment trends (last 12 months)
    prisma.$queryRaw<Array<{ month: Date; count: number; total_amount: number; avg_amount: number }>>`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*)::integer as count,
        SUM(amount)::float as total_amount,
        AVG(amount)::float as avg_amount
      FROM "Investment"
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `,

    // Top performing products
    prisma.product.findMany({
      include: {
        _count: { select: { investments: true } },
        investments: {
          select: { amount: true, status: true },
          where: { status: { in: ["ACTIVE", "COMPLETED"] } }
        }
      },
      orderBy: {
        investments: { _count: "desc" }
      },
      take: 10
    }),

    // Investment distribution by user count
    prisma.user.findMany({
      where: {
        investments: {
          some: {}
        }
      },
      include: {
        _count: {
          select: {
            investments: true
          }
        }
      }
    }),

    // Revenue breakdown by product
    prisma.$queryRaw<Array<{ product_name: string; total_revenue: number; investment_count: number }>>`
      SELECT 
        p.name as product_name,
        SUM(i.amount)::float as total_revenue,
        COUNT(i.id)::integer as investment_count
      FROM "Investment" i
      JOIN "Product" p ON i."productId" = p.id
      WHERE i.status IN ('ACTIVE', 'COMPLETED')
      GROUP BY p.id, p.name
      ORDER BY total_revenue DESC
      LIMIT 10
    `,

    // Completion rates by product type
    prisma.$queryRaw<Array<{ 
      product_type: string; 
      total_investments: number; 
      completed_investments: number; 
      completion_rate: number;
      avg_completion_time: number;
    }>>`
      SELECT 
        pt.name as product_type,
        COUNT(i.id)::integer as total_investments,
        SUM(CASE WHEN i.status = 'COMPLETED' THEN 1 ELSE 0 END)::integer as completed_investments,
        (SUM(CASE WHEN i.status = 'COMPLETED' THEN 1 ELSE 0 END)::float / COUNT(i.id)::float * 100) as completion_rate,
        AVG(CASE 
          WHEN i.status = 'COMPLETED' AND i."modifiedAt" IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (i."modifiedAt" - i."createdAt")) / 86400 
          ELSE NULL 
        END)::float as avg_completion_time
      FROM "Investment" i
      JOIN "ProductType" pt ON i."productTypeId" = pt.id
      GROUP BY pt.id, pt.name
      HAVING COUNT(i.id) > 0
      ORDER BY completion_rate DESC
    `
  ]);

  const analyticsData = {
    overview: {
      totalInvestments: totalStats._count._all,
      totalValue: totalStats._sum.amount || 0,
      totalExpectedReturn: totalStats._sum.expectedReturn || 0,
      averageInvestment: totalStats._avg.amount || 0,
      averageProgress: totalStats._avg.progress || 0,
      averagePlots: totalStats._avg.numberOfPlots || 0,
    },
    trends: {
      monthly: monthlyTrends,
      status: statusBreakdown,
    },
    products: {
      top: topProducts,
      revenue: revenueByProduct,
      completion: completionRates,
    },
    users: {
      distribution: userDistribution,
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Investment Analytics</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive insights into investment performance, trends, and user behavior.
        </p>
      </div>
      
      <InvestmentAnalytics data={analyticsData} />
    </div>
  );
}