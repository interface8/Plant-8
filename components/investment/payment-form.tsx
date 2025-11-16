"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { InvestmentState } from "@/store/slices/investmentSlice";
import { setError } from "@/store/slices/investmentSlice";
import { useSession } from "next-auth/react";

interface PaymentFormProps {
  onSuccess?: () => void;
}

export default function PaymentForm({ onSuccess }: PaymentFormProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const investmentData = useSelector((state: { investment: InvestmentState }) => state.investment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handlePayment = async () => {
    setIsSubmitting(true);
    dispatch(setError(null));

    // Allow guest checkout: collect guest info when no authenticated session
    const buyerId = session?.user?.id || null;

    if (
      !investmentData.productId ||
      !investmentData.productTypeId ||
      !investmentData.durationId
    ) {
      dispatch(setError("Invalid investment data."));
      setIsSubmitting(false);
      return;
    }

    if (
      !investmentData.productId ||
      !investmentData.productTypeId ||
      !investmentData.landId ||
      !investmentData.durationId
    ) {
      dispatch(setError("Invalid investment data."));
      setIsSubmitting(false);
      return;
    }

    try {
      // Create an order + initialize Monnify transaction on the server
      const initResp = await fetch("/api/monnify/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: investmentData.amount || investmentData.totalInvestment || 0,
          customerName: session?.user?.name || "Guest",
          customerEmail: session?.user?.email || "guest@example.com",
          customerPhone: session?.user?.phoneNo || undefined,
          meta: {
            type: "investment",
            productId: investmentData.productId,
            durationId: investmentData.durationId,
            numberOfPlots: investmentData.numberOfPlots,
            numberOfTerms: investmentData.numberOfTerms,
          },
        }),
      });

      const initJson = await initResp.json();
      if (!initResp.ok) {
        dispatch(setError(initJson.error || "Failed to initialize payment."));
        setIsSubmitting(false);
        return;
      }

      const { publicKey, paymentReference, amount, orderId, contractCode } = initJson;

      // Load Monnify SDK dynamically
      await new Promise<void>((resolve) => {
        if ((window as any).Monnify) return resolve();
        const s = document.createElement("script");
        s.src = "https://sdk.monnify.com/plugin/monnify.js";
        s.onload = () => resolve();
        document.body.appendChild(s);
      });

      // @ts-ignore - Monnify SDK global
      const Monnify = (window as any).Monnify || (window as any).MonnifySDK;
      if (!Monnify) {
        dispatch(setError("Payment SDK failed to load."));
        setIsSubmitting(false);
        return;
      }

      Monnify.initialize({
        amount: amount,
        currency: "NGN",
        reference: paymentReference,
        customerName: initJson.customerName,
        customerEmail: initJson.customerEmail,
        apiKey: publicKey,
        contractCode: contractCode,
        onComplete: async (response: any) => {
          // Verify transaction on server
          try {
            const verifyResp = await fetch("/api/monnify/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentReference: response.paymentReference || paymentReference,
                orderId,
              }),
            });
            const verifyJson = await verifyResp.json();
            if (verifyResp.ok && verifyJson.status === "PAID") {
              // Create investment record pointing to order/buyer
              const createInv = await fetch("/api/investments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: buyerId,
                  orderId,
                  productId: investmentData.productId,
                  productTypeId: investmentData.productTypeId,
                  landId: investmentData.landId,
                  plotSize: investmentData.plotSize,
                  numberOfPlots: investmentData.numberOfPlots,
                  numberOfTerms: investmentData.numberOfTerms,
                  durationId: investmentData.durationId,
                  amount: amount,
                }),
              });
              const invJson = await createInv.json();
              if (createInv.ok) {
                onSuccess?.();
                setIsNavigating(true);
                router.push(`/investments/summary?status=success&order=${orderId}`);
              } else {
                dispatch(setError(invJson.error || "Failed to create investment."));
              }
            } else {
              dispatch(setError("Payment verification failed."));
            }
          } catch (err) {
            dispatch(setError("Verification error."));
          } finally {
            setIsSubmitting(false);
          }
        },
        onClose: () => {
          // optional cleanup
        },
      });
    } catch {
      dispatch(setError("Payment failed. Please try again."));
    } finally {
      // setIsSubmitting is handled in callbacks; ensure false in case of early exit
      setIsSubmitting(false);
    }
  };

  if (isNavigating) {
    return <p>Navigating to dashboard...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Complete Payment</h1>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Total Investment: ₦{investmentData.totalInvestment?.toLocaleString()}
          </p>
        </div>
        {investmentData.error && (
          <p className="text-red-500 text-sm">{investmentData.error}</p>
        )}
        <button
          type="button"
          onClick={handlePayment}
          disabled={isSubmitting || !session?.user?.id}
          className={`w-full bg-green-600 text-white px-4 py-2 rounded-md ${
            isSubmitting || !session?.user?.id
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-700"
          } transition-colors`}
          aria-label="Complete Payment"
        >
          {isSubmitting ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
