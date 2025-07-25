import { NextResponse } from "next/server";
import prisma from "@/db/prisma";

export async function GET() {
  try {
    const durations = await prisma.duration.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    return NextResponse.json(durations, { status: 200 });
  } catch (error) {
    console.error("Error fetching durations:", error);
    return NextResponse.json(
      { error: "Failed to fetch durations" },
      { status: 500 }
    );
  }
}
