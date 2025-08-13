import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getProduct,
  getLand,
  getDuration,
} from "@/lib/services/investment-service";
import InvestmentSummaryForm from "@/components/investment/investmentSummaryForm";
import StepIndicator from "@/components/investment/step-indicator";

export const metadata = {
  title: "Investment Summary - FAM 8",
  description: "Review your investment details before proceeding to payment.",
  keywords: "investment summary, agricultural investment, FAM 8",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Investment Summary - FAM 8",
    description: "Review your investment details before proceeding to payment.",
    type: "website",
  },
};

export default async function InvestmentSummaryPage({
  searchParams,
}: {
  searchParams: Promise<{
    productId: string;
    productTypeId: string;
    landId: string;
    plotSize: string;
    numberOfPlots: string;
    durationId: string;
    numberOfTerms: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const {
    productId,
    productTypeId,
    landId,
    plotSize,
    numberOfPlots,
    durationId,
    numberOfTerms,
  } = await searchParams;
  if (
    !productId ||
    !productTypeId ||
    !landId ||
    !plotSize ||
    !numberOfPlots ||
    !durationId ||
    !numberOfTerms
  ) {
    return notFound();
  }

  const product = await getProduct(productId);
  const land = await getLand(landId);
  const duration = await getDuration(durationId);
  if (
    !product ||
    !land ||
    !duration ||
    product.productTypeId !== productTypeId
  ) {
    return notFound();
  }

  if (!["HALF", "FULL"].includes(plotSize)) {
    return notFound();
  }

  const parsedPlots = parseInt(numberOfPlots);
  const parsedTerms = parseInt(numberOfTerms);
  if (
    isNaN(parsedPlots) ||
    isNaN(parsedTerms) ||
    parsedPlots < 1 ||
    parsedPlots > 10 ||
    parsedTerms < 1 ||
    parsedTerms > 4
  ) {
    return notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <StepIndicator currentStep={3} />
      <h1
        className="text-3xl font-bold mb-4"
        aria-label={`Investment Summary for ${product.name}`}
      >
        Investment Summary
      </h1>
      <InvestmentSummaryForm
        product={product}
        land={land}
        duration={duration}
        plotSize={plotSize as "HALF" | "FULL"}
        numberOfPlots={parsedPlots}
        numberOfTerms={parsedTerms}
      />
    </div>
  );
}
