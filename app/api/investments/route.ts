import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { investmentSchema } from "@/lib/validators/investment-schema-validators";
import { calculateInvestmentROI } from "@/lib/utils/investmentCalculator";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const investments = await prisma.investment.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        userId: true,
        inspectorId: true,
        productId: true,
        productTypeId: true,
        landId: true,
        plotSize: true,
        numberOfPlots: true,
        numberOfTerms: true,
        amount: true,
        expectedReturn: true,
        progress: true,
        status: true,
        createdAt: true,
        createdBy: true,
        modifiedAt: true,
        modifiedBy: true,
        product: {
          select: {
            id: true,
            name: true,
            images: { select: { url: true } },
            farmerMonthlyPayment: true,
            duration: { select: { id: true, name: true } },
          },
        },
        productType: { select: { id: true, name: true } },
        land: {
          select: {
            id: true,
            name: true,
            gpsCoordinates: true,
            dailyPrice: true,
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
      },
      orderBy: { createdAt: "desc" },
    });

    // Map product.images from {url: string}[] to string[]
    const investmentsWithImages = investments.map((inv) => ({
      ...inv,
      product: {
        ...inv.product,
        images: Array.isArray(inv.product.images) ? inv.product.images.map((img) => img.url) : [],
      },
    }));
    return NextResponse.json(investmentsWithImages, { status: 200 });
  } catch (error) {
    console.error("Error fetching investments:", error);
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = investmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      userId,
      productId,
      productTypeId,
      landId,
      plotSize,
      numberOfPlots,
      numberOfTerms,
    } = parsed.data;

    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: Invalid user ID" },
        { status: 403 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        productTypeId: true,
        durationId: true,
        currentMarketPricePerKg: true,
        farmerMonthlyPayment: true,
        roi: true,
        estimatedHarvestQuantityPerPlot: true,
        daysToHarvestPerPlot: true,
        minimumNoOfFarmersPerPlot: true,
        dailyMaintenanceFee: true,
        images: { select: { url: true } },
        ProductType: { select: { id: true, name: true } },
        duration: { select: { id: true, name: true } },
      },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    // Map product images to string array
    const productWithImages = {
      ...product,
      images: Array.isArray(product.images) ? product.images.map((img) => img.url) : [],
    };
    
    if (productWithImages.productTypeId !== productTypeId) {
      return NextResponse.json(
        { error: "Invalid product type" },
        { status: 400 }
      );
    }

    const land = await prisma.land.findUnique({
      where: { id: landId },
      select: { 
        id: true,
        name: true,
        gpsCoordinates: true,
        imageUrl: true,
        locationId: true,
        dailyPrice: true,
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
    });
    if (!land) {
      return NextResponse.json({ error: "Land not found" }, { status: 404 });
    }

    // Calculate investment amount using the calculator
    // Use minimum number of farmers if not provided
    const numberOfFarmers = productWithImages.minimumNoOfFarmersPerPlot;
    const calculationResult = calculateInvestmentROI(
      0, // Initial investment (we're calculating it)
      productWithImages,
      land,
      numberOfPlots,
      numberOfFarmers,
      numberOfTerms
    );
    
    const amount = calculationResult.totalCost;
    const expectedReturn = calculationResult.estimatedRevenue;

    // Get all pre-tasks for this product
    const preTasks = await prisma.preTask.findMany({
      where: { productId: productId },
      orderBy: { estimatedCompletionDate: 'asc' },
    });

    // Create investment and associated tasks in a transaction
    const investment = await prisma.$transaction(async (tx) => {
      // Create the investment
      const newInvestment = await tx.investment.create({
        data: {
          userId,
          productId,
          productTypeId,
          landId,
          plotSize,
          numberOfPlots,
          numberOfTerms,
          numberOfFarmers,
          amount,
          expectedReturn,
          totalCost: calculationResult.totalCost,
          estimatedRevenue: calculationResult.estimatedRevenue,
          adjustedRevenue: calculationResult.adjustedRevenue,
          netReturn: calculationResult.netReturn,
          roiPercent: calculationResult.roiPercent,
          roiPerDay: calculationResult.roiPerDay,
          adjustedYield: calculationResult.adjustedYield,
          effectiveDaysToHarvest: calculationResult.effectiveDaysToHarvest,
          estimatedHarvestQuantity: calculationResult.estimatedHarvestQuantity,
          progress: 0,
          status: "PENDING",
          createdBy: session.user.id,
        },
        include: {
          product: { select: { name: true, images: { select: { url: true } } } },
          land: { select: { name: true } },
        },
      });

      // Copy all pre-tasks to tasks for this investment
      if (preTasks.length > 0) {
        await tx.task.createMany({
          data: preTasks.map((preTask) => ({
            investmentId: newInvestment.id,
            userId: userId,
            name: preTask.title,
            description: preTask.description || '',
            status: 'PENDING',
          })),
        });
        console.log(`✅ Created ${preTasks.length} tasks for investment ${newInvestment.id}`);
      }

      return newInvestment;
    });

    return NextResponse.json(
      {
        message: "Investment created successfully",
        investment: {
          id: investment.id,
          productName: investment.product.name,
          productImages: Array.isArray(investment.product.images) ? investment.product.images.map((img) => img.url) : [],
          landName: investment.land?.name,
          numberOfPlots: investment.numberOfPlots,
          numberOfTerms: investment.numberOfTerms,
          amount: investment.amount,
          expectedReturn: investment.expectedReturn,
          status: investment.status,
          tasksCreated: preTasks.length,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating investment:", error);
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 }
    );
  }
}
