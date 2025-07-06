import prisma from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const productTypes = await prisma.productType.findMany({
      include: {
        children: true,
      },
    });

    return NextResponse.json(productTypes);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
