"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { z } from "zod";
import { Land } from "@/types/land";
import { Product } from "@/types/product";

const investmentDetailsSchema = z.object({
  plotSize: z.enum(["HALF", "FULL"]).optional(),
  numberOfPlots: z
    .number()
    .int()
    .min(1, "Select at least 1 plot")
    .max(10, "Cannot select more than 10 plots"),
  durationId: z.string().uuid("Please select a duration"),
  numberOfTerms: z
    .number()
    .int()
    .min(1, "Select at least 1 term")
    .max(4, "Cannot select more than 4 terms"),
});

type InvestmentDetailsFormData = z.infer<typeof investmentDetailsSchema>;

interface InvestmentDetailsFormProps {
  product: Product;
  land: Land;
  durations: { id: string; name: string }[];
}

export default function InvestmentDetailsForm({
  product,
  land,
  durations,
}: InvestmentDetailsFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<InvestmentDetailsFormData>({
    plotSize: "FULL",
    numberOfPlots: 1,
    durationId: product.durationId,
    numberOfTerms: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      setError("Please sign in to invest.");
      return;
    }

    const parsed = investmentDetailsSchema.safeParse(formData);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      router.push(
        `/investments/summary?productId=${product.id}&productTypeId=${
          product.productTypeId
        }&landId=${land.id}&plotSize=${formData.plotSize || ""}&numberOfPlots=${
          formData.numberOfPlots
        }&durationId=${formData.durationId}&numberOfTerms=${
          formData.numberOfTerms
        }`
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to proceed. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (status !== "authenticated") {
    return (
      <div className="mt-6">
        <Link
          href="/sign-in"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          aria-label="Sign in to invest"
        >
          Sign In to Invest
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Crop Information</h3>
        <p className="text-gray-600">
          {product.name} - {product.description}
        </p>
      </div>
      <div>
        <label
          htmlFor="plotSize"
          className="block text-sm font-medium text-gray-700"
        >
          Plot Size
        </label>
        <select
          id="plotSize"
          value={formData.plotSize || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              plotSize: e.target.value as "HALF" | "FULL",
            })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="HALF">
            Half Plot (₦{land.halfPlotPrice.toLocaleString()})
          </option>
          <option value="FULL">
            Full Plot (₦{land.fullPlotPrice.toLocaleString()})
          </option>
        </select>
      </div>
      <div>
        <label
          htmlFor="numberOfPlots"
          className="block text-sm font-medium text-gray-700"
        >
          Number of Plots (1-10)
        </label>
        <input
          type="number"
          id="numberOfPlots"
          value={formData.numberOfPlots}
          onChange={(e) =>
            setFormData({
              ...formData,
              numberOfPlots: parseInt(e.target.value),
            })
          }
          min="1"
          max="10"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="durationId"
          className="block text-sm font-medium text-gray-700"
        >
          Duration
        </label>
        <select
          id="durationId"
          value={formData.durationId}
          onChange={(e) =>
            setFormData({ ...formData, durationId: e.target.value })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
          required
        >
          {durations.map((duration) => (
            <option key={duration.id} value={duration.id}>
              {duration.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="numberOfTerms"
          className="block text-sm font-medium text-gray-700"
        >
          Number of Terms (1-4)
        </label>
        <input
          type="number"
          id="numberOfTerms"
          value={formData.numberOfTerms}
          onChange={(e) =>
            setFormData({
              ...formData,
              numberOfTerms: parseInt(e.target.value),
            })
          }
          min="1"
          max="4"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-green-600 text-white px-4 py-2 rounded-md ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        } transition-colors`}
        aria-label="Proceed to Investment Summary"
      >
        {isSubmitting ? "Submitting..." : "View Investment Summary"}
      </button>
    </form>
  );
}
