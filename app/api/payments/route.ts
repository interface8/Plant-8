import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { EmailService } from "@/lib/services/email-service";
import prisma from "@/db/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount, paymentMethod, userId } = await request.json();
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: Invalid user ID" },
        { status: 403 }
      );
    }

    if (!amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // i'm going to Replace with actual payment gateway integration (e.g., Paystack, Stripe)
    const paymentResult = {
      id: `pay_${Math.random().toString(36).slice(2)}`,
      status: "success",
      amount,
      paymentMethod,
    };

    // Send payment receipt email
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, name: true },
      });

      if (user?.email && user?.name) {
        await EmailService.sendPaymentReceiptEmail(
          user.email,
          user.name,
          {
            amount,
            transactionId: paymentResult.id,
            productName: "Investment Payment", // You may want to pass this from the request
            date: new Date(),
          }
        );
      }
    } catch (emailError) {
      console.error("Failed to send payment receipt email:", emailError);
      // Don't fail the payment if email fails
    }

    return NextResponse.json(paymentResult, { status: 200 });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
