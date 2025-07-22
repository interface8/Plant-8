import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { z } from "zod";

const productTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  prevId: z.string().uuid().optional().nullable(),
  growthDuration: z.string().optional(),
  expectedReturnRate: z.number().optional(),
  durationId: z.string().uuid().optional().nullable(),
});

// const updateProductTypeSchema = productTypeSchema.partial();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    const category = url.searchParams.get("category");
    const durationId = url.searchParams.get("durationId");
    const parentId = url.searchParams.get("parentId");

    // Handle duration-based filtering
    if (durationId) {
      const productTypes = await prisma.productType.findMany({
        where: {
          durationId,
          category: { in: ["Crop", "Livestock"] },
        },
        include: {
          parent: true,
          children: {
            include: {
              children: true,
            },
          },
          productsByType: true,
          productsByClass: true,
          productTypeInvestments: {
            include: { product: { select: { name: true, imageUrl: true } } },
          },
          duration: true,
        },
      });
      return NextResponse.json(productTypes);
    }

    if (parentId) {
      const productTypes = await prisma.productType.findMany({
        where: {
          prevId: parentId,
        },
        include: {
          parent: true,
          children: {
            include: {
              children: true,
            },
          },
          productsByType: {
            include: {
              type: true,
            },
          },
          productsByClass: true,
          productTypeInvestments: {
            include: { product: { select: { name: true, imageUrl: true } } },
          },
          duration: true,
        },
      });
      return NextResponse.json(productTypes);
    }

    if (name && category) {
      const productTypes = await prisma.productType.findMany({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
          category: category,
        },
        include: {
          parent: true,
          children: {
            include: {
              children: true,
            },
          },
          productsByType: true,
          productsByClass: true,
          productTypeInvestments: {
            include: { product: { select: { name: true, imageUrl: true } } },
          },
          duration: true,
        },
      });
      return NextResponse.json(productTypes);
    }

    const productTypes = await prisma.productType.findMany({
      include: {
        parent: true,
        children: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        },
        productsByType: true,
        productsByClass: true,
        productTypeInvestments: {
          include: { product: { select: { name: true, imageUrl: true } } },
        },
        duration: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(productTypes);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch product types" },
      { status: 500 }
    );
  }
}

// export async function GET(request: Request) {
//   try {
//     const url = new URL(request.url);
//     const name = url.searchParams.get("name");
//     const category = url.searchParams.get("category");
//     const durationId = url.searchParams.get("durationId");
//     const parentId = url.searchParams.get("parentId");

//     if (durationId) {
//       const productTypes = await prisma.productType.findMany({
//         where: {
//           durationId,
//           category: { in: ["Crop", "Livestock"] },
//         },
//         include: {
//           parent: true,
//           children: true,
//           productsByType: true,
//           productsByClass: true,
//           productTypeInvestments: {
//             include: { product: { select: { name: true, imageUrl: true } } },
//           },
//           duration: true,
//         },
//       });
//       return NextResponse.json(productTypes);
//     }

//     if (parentId) {
//       const productTypes = await prisma.productType.findMany({
//         where: {
//           prevId: parentId,
//           category: { in: ["Crop", "Livestock"] },
//         },
//         include: {
//           parent: true,
//           children: true,
//           productsByType: true,
//           productsByClass: true,
//           productTypeInvestments: {
//             include: { product: { select: { name: true, imageUrl: true } } },
//           },
//           duration: true,
//         },
//       });
//       return NextResponse.json(productTypes);
//     }

//     if (name && category) {
//       const productTypes = await prisma.productType.findMany({
//         where: {
//           name,
//           category:
//             category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
//         },
//         include: {
//           parent: true,
//           children: true,
//           productsByType: true,
//           productsByClass: true,
//           productTypeInvestments: {
//             include: { product: { select: { name: true, imageUrl: true } } },
//           },
//           duration: true,
//         },
//       });
//       return NextResponse.json(productTypes);
//     }

//     const productTypes = await prisma.productType.findMany({
//       include: {
//         parent: true,
//         children: true,
//         productsByType: true,
//         productsByClass: true,
//         productTypeInvestments: {
//           include: { product: { select: { name: true, imageUrl: true } } },
//         },
//         duration: true,
//       },
//       orderBy: { createdAt: "asc" },
//     });
//     return NextResponse.json(productTypes);
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { error: "Failed to fetch product types" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = productTypeSchema.parse(body);

    const existingProductType = await prisma.productType.findUnique({
      where: { name: validatedData.name },
    });
    if (existingProductType) {
      return NextResponse.json(
        { error: "Product type name must be unique" },
        { status: 400 }
      );
    }

    if (validatedData.prevId) {
      const parentExists = await prisma.productType.findUnique({
        where: { id: validatedData.prevId },
      });
      if (!parentExists) {
        return NextResponse.json(
          { error: "Parent product type not found" },
          { status: 400 }
        );
      }
    }

    if (validatedData.durationId) {
      const durationExists = await prisma.productType.findUnique({
        where: { id: validatedData.durationId },
      });
      if (!durationExists) {
        return NextResponse.json(
          { error: "Duration not found" },
          { status: 400 }
        );
      }
    }

    const productType = await prisma.productType.create({
      data: { ...validatedData, createdAt: new Date() },
      include: {
        parent: true,
        children: true,
        productsByType: true,
        productsByClass: true,
        productTypeInvestments: {
          include: { product: { select: { name: true, imageUrl: true } } },
        },
        duration: true,
      },
    });
    return NextResponse.json(productType, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create product type" },
      { status: 500 }
    );
  }
}
