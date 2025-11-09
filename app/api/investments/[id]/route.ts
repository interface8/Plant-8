import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

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
      return NextResponse.json(
        { error: "Investment not found" },
        { status: 404 }
      );
    }

    // Verify the investment belongs to the user
    if (investment.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this investment" },
        { status: 403 }
      );
    }

    // Calculate task completion statistics
    const totalTasks = investment.tasks.length;
    const completedTasks = investment.tasks.filter(t => t.status === 'COMPLETED').length;
    const inProgressTasks = investment.tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const pendingTasks = investment.tasks.filter(t => t.status === 'PENDING').length;
    const overdueTasks = investment.tasks.filter(t => t.status === 'OVERDUE').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Map product.images from {url: string}[] to string[]
    const investmentWithImages = {
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

    return NextResponse.json(investmentWithImages, { status: 200 });
  } catch (error) {
    console.error("Error fetching investment:", error);
    return NextResponse.json(
      { error: "Failed to fetch investment" },
      { status: 500 }
    );
  }
}
