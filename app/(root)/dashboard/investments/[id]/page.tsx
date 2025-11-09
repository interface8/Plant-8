import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import InvestmentDetailView from "@/components/dashboard/investment-detail-view";

interface InvestmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 10;

async function getInvestmentData(investmentId: string, userId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/investments/${investmentId}`,
      {
        headers: {
          'Cookie': `next-auth.session-token=${userId}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch investment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching investment:', error);
    return null;
  }
}

export default async function InvestmentDetailPage({
  params,
}: InvestmentDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { id } = await params;
  
  // For server-side, we'll use Prisma directly
  const prisma = (await import("@/db/prisma")).default;
  
  const investment = await prisma.investment.findUnique({
    where: { id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          description: true,
          images: { select: { url: true } },
          farmerMonthlyPayment: true,
          roi: true,
          currentMarketPricePerKg: true,
          estimatedHarvestQuantityPerPlot: true,
          daysToHarvestPerPlot: true,
          duration: { select: { id: true, name: true } },
          ProductType: { select: { id: true, name: true } },
        },
      },
      productType: { select: { id: true, name: true } },
      land: {
        select: {
          id: true,
          name: true,
          gpsCoordinates: true,
          dailyPrice: true,
          imageUrl: true,
          fertilizerCostPerPlot: true,
          inspectionDailyFee: true,
          inflationRate: true,
          location: {
            select: {
              id: true,
              name: true,
              state: { select: { id: true, name: true } },
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      tasks: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          imageUrl: true,
          completedAt: true,
          createdAt: true,
          updatedAt: true,
          inspectorId: true,
          inspector: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!investment) {
    notFound();
  }

  // Verify the investment belongs to the user
  if (investment.userId !== session.user.id) {
    redirect("/dashboard");
  }

  // Calculate task completion statistics
  const totalTasks = investment.tasks.length;
  const completedTasks = investment.tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgressTasks = investment.tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const pendingTasks = investment.tasks.filter(t => t.status === 'PENDING').length;
  const overdueTasks = investment.tasks.filter(t => t.status === 'OVERDUE').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Map product images
  const investmentData = {
    ...investment,
    product: {
      ...investment.product,
      images: Array.isArray(investment.product?.images)
        ? investment.product.images.map((img) => img.url)
        : [],
    },
    taskStats: {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      pending: pendingTasks,
      overdue: overdueTasks,
      progressPercentage,
    },
  };

  return <InvestmentDetailView investment={investmentData} />;
}
