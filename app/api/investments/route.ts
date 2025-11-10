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
    
    // First calculate to get total cost
    const initialCalc = calculateInvestmentROI(
      1, // Temporary value to avoid division by zero
      productWithImages,
      land,
      numberOfPlots,
      numberOfFarmers,
      numberOfTerms
    );
    
    // Now recalculate with actual total cost as investment amount
    const calculationResult = calculateInvestmentROI(
      initialCalc.totalCost,
      productWithImages,
      land,
      numberOfPlots,
      numberOfFarmers,
      numberOfTerms
    );
    
    const amount = calculationResult.totalCost;
    const expectedReturn = calculationResult.estimatedRevenue;

    // Validate calculation results to prevent invalid float values
    const safeFloat = (value: number, defaultValue: number = 0): number => {
      if (!isFinite(value) || isNaN(value)) {
        console.warn(`Invalid float value detected: ${value}, using default: ${defaultValue}`);
        return defaultValue;
      }
      return value;
    };

    // Get all pre-tasks for this product
    const preTasks = await prisma.preTask.findMany({
      where: { productId: productId },
      orderBy: { estimatedCompletionDate: 'asc' },
      select: {
        title: true,
        description: true,
      }
    });
    
    console.log(`📋 Found ${preTasks.length} pre-tasks for product ${productId}`);

    // Create investment and associated tasks in a transaction with timeout
    const investment = await prisma.$transaction(async (tx) => {
      // Create the investment
      const newInvestment = await tx.investment.create({
        data: {
          user: {
            connect: { id: userId }
          },
          product: {
            connect: { id: productId }
          },
          productType: {
            connect: { id: productTypeId }
          },
          land: landId ? {
            connect: { id: landId }
          } : undefined,
          createdByUser: {
            connect: { id: session.user.id }
          },
          plotSize,
          numberOfPlots,
          numberOfTerms,
          numberOfFarmers,
          amount,
          expectedReturn,
          totalCost: safeFloat(calculationResult.totalCost),
          estimatedRevenue: safeFloat(calculationResult.estimatedRevenue),
          adjustedRevenue: safeFloat(calculationResult.adjustedRevenue),
          netReturn: safeFloat(calculationResult.netReturn),
          roiPercent: safeFloat(calculationResult.roiPercent),
          roiPerDay: safeFloat(calculationResult.roiPerDay),
          adjustedYield: safeFloat(calculationResult.adjustedYield),
          effectiveDaysToHarvest: Math.max(1, calculationResult.effectiveDaysToHarvest),
          estimatedHarvestQuantity: safeFloat(calculationResult.estimatedHarvestQuantity),
          progress: 0,
          status: "PENDING",
        },
        select: {
          id: true,
          amount: true,
          expectedReturn: true,
          status: true,
          numberOfPlots: true,
          numberOfTerms: true,
          product: { select: { name: true, images: { select: { url: true }, take: 1 } } },
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
      } else {
        console.warn(`⚠️ No pre-tasks found for product ${productId}. Tasks will not be created.`);
      }

      return newInvestment;
    }, {
      maxWait: 10000, // 10 seconds max wait to start transaction
      timeout: 15000, // 15 seconds max transaction time
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
