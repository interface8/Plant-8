import { NextResponse } from "next/server";
import { EmailService } from "@/lib/services/email-service";
import prisma from "@/db/prisma";

export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all users with active investments
    const users = await prisma.user.findMany({
      where: {
        investments: {
          some: { status: "ACTIVE" },
        },
      },
      include: {
        investments: {
          where: { status: "ACTIVE" },
          include: {
            product: {
              include: { duration: true },
            },
          },
        },
      },
    });

    let successCount = 0;
    let failedCount = 0;

    // Send report to each user
    for (const user of users) {
      if (!user.email || !user.name) {
        console.log(`Skipping user ${user.id} - missing email or name`);
        continue;
      }

      try {
        const investments = user.investments.map((inv) => {
          const startDate = new Date(inv.createdAt);
          const now = new Date();
          const durationMonths = parseInt(inv.product.duration.name);
          const endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + durationMonths);

          const totalDays = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          const daysPassed = Math.ceil(
            (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          const daysRemaining = totalDays - daysPassed;
          const progress = Math.min(
            Math.round((daysPassed / totalDays) * 100),
            100
          );

          return {
            productName: inv.product.name,
            amount: inv.amount,
            progress,
            daysRemaining: Math.max(daysRemaining, 0),
            status: inv.status,
          };
        });

        await EmailService.sendWeeklyProgressReport(
          user.email,
          user.name,
          investments
        );
        
        successCount++;
      } catch (emailError) {
        console.error(`Failed to send weekly report to user ${user.id}:`, emailError);
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      userCount: users.length,
      successCount,
      failedCount,
      message: `Weekly reports sent to ${successCount} users, ${failedCount} failed`,
    });
  } catch (error) {
    console.error("Weekly report cron error:", error);
    return NextResponse.json(
      { error: "Failed to send weekly reports" },
      { status: 500 }
    );
  }
}
