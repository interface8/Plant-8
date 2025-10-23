import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const updateInvestmentSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "FAILED"]).optional(),
  progress: z.number().min(0).max(100).optional(),
  expectedReturn: z.number().min(0).optional(),
  inspectorId: z.string().uuid().optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.roles?.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    // Filters
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build where clause
    const where: Prisma.InvestmentWhereInput = {};
    
    if (status) {
      where.status = status as "PENDING" | "ACTIVE" | "COMPLETED" | "FAILED";
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (productId) {
      where.productId = productId;
    }
    
    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount.gte = parseFloat(minAmount);
      if (maxAmount) where.amount.lte = parseFloat(maxAmount);
    }
    
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }
    
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { product: { name: { contains: search, mode: "insensitive" } } },
        { productType: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Build order clause
    let orderBy: Prisma.InvestmentOrderByWithRelationInput = {};
    const sortOrderValue = sortOrder as "asc" | "desc";
    
    if (sortBy === "userName") {
      orderBy = { user: { name: sortOrderValue } };
    } else if (sortBy === "productName") {
      orderBy = { product: { name: sortOrderValue } };
    } else if (sortBy === "createdAt") {
      orderBy = { createdAt: sortOrderValue };
    } else if (sortBy === "amount") {
      orderBy = { amount: sortOrderValue };
    } else if (sortBy === "status") {
      orderBy = { status: sortOrderValue };
    } else if (sortBy === "progress") {
      orderBy = { progress: sortOrderValue };
    } else {
      orderBy = { createdAt: sortOrderValue };
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

    // Map product.images from {url: string}[] to string[]
    const investmentsWithImages = investments.map((inv) => ({
      ...inv,
      product: {
        ...inv.product,
        images: Array.isArray(inv.product.images) ? inv.product.images.map((img) => img.url) : [],
      },
    }));
    return NextResponse.json({
      investments: investmentsWithImages,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: stats.reduce((acc, stat) => {
        acc[stat.status] = {
          count: stat._count._all,
          totalAmount: stat._sum.amount || 0,
          averageProgress: stat._avg.progress || 0,
        };
        return acc;
      }, {} as Record<string, { count: number; totalAmount: number; averageProgress: number }>),
    });
  } catch (error) {
    console.error("GET /api/admin/investments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.roles?.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Investment ID required" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = updateInvestmentSchema.safeParse(body);
    
    if (!parsed.success) {
      const errorMessage = parsed.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return NextResponse.json(
        { error: errorMessage || "Validation failed" },
        { status: 400 }
      );
    }

    // Check if investment exists
    const existingInvestment = await prisma.investment.findUnique({ 
      where: { id },
      include: {
        user: { select: { name: true, email: true } }
      }
    });
    
    if (!existingInvestment) {
      return NextResponse.json({ error: "Investment not found" }, { status: 404 });
    }

    // If inspector is being assigned, verify they exist and have inspector role
    if (parsed.data.inspectorId) {
      const inspector = await prisma.user.findFirst({
        where: {
          id: parsed.data.inspectorId,
          roles: { some: { role: { name: "INSPECTOR" } } }
        }
      });
      
      if (!inspector) {
        return NextResponse.json({ 
          error: "Inspector not found or user does not have inspector role" 
        }, { status: 404 });
      }
    }

    const investment = await prisma.investment.update({
      where: { id },
      data: {
        ...parsed.data,
        modifiedBy: session.user.id,
        modifiedAt: new Date(),
      },
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
      },
    });

    return NextResponse.json({ 
      message: "Investment updated successfully", 
      investment 
    });
  } catch (error) {
    console.error("PUT /api/admin/investments error:", error);
    return NextResponse.json(
      { error: "Failed to update investment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.roles?.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Investment ID required" }, { status: 400 });
    }

    // Check if investment exists and get related data
    const investment = await prisma.investment.findUnique({
      where: { id },
      include: {
        tasks: true,
        user: { select: { name: true, email: true } }
      },
    });

    if (!investment) {
      return NextResponse.json({ error: "Investment not found" }, { status: 404 });
    }

    // Check if investment has tasks
    if (investment.tasks.length > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete investment. It has ${investment.tasks.length} associated task(s). Please handle tasks first.` 
        },
        { status: 409 }
      );
    }

    // Only allow deletion of PENDING or FAILED investments
    if (!["PENDING", "FAILED"].includes(investment.status)) {
      return NextResponse.json(
        { 
          error: `Cannot delete ${investment.status.toLowerCase()} investment. Only pending or failed investments can be deleted.` 
        },
        { status: 409 }
      );
    }

    await prisma.investment.delete({ where: { id } });

    return NextResponse.json({ 
      message: "Investment deleted successfully" 
    });
  } catch (error) {
    console.error("DELETE /api/admin/investments error:", error);
    return NextResponse.json(
      { error: "Failed to delete investment" },
      { status: 500 }
    );
  }
}