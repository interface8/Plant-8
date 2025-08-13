import { notFound, redirect } from "next/navigation";
import {
  getProduct,
  getLand,
  getDurations,
} from "@/lib/services/investment-service";
import InvestmentDetailsForm from "@/components/investment/investmentDetailsForm";
import StepIndicator from "@/components/investment/step-indicator";
import { auth } from "@/auth";

export const metadata = {
  title: "Investment Details - FAM 8",
  description: "Specify details for your investment on FAM 8.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Investment Details - FAM 8",
    description: "Specify details for your investment on FAM 8.",
    type: "website",
  },
};

export default async function InvestmentDetailsPage({
  searchParams,
}: {
  searchParams: Promise<{
    productId: string;
    productTypeId: string;
    landId: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { productId, productTypeId, landId } = await searchParams;
  if (!productId || !productTypeId || !landId) {
    return notFound();
  }

  const product = await getProduct(productId);
  const land = await getLand(landId);
  const durations = await getDurations();
  if (
    !product ||
    !land ||
    !durations ||
    product.productTypeId !== productTypeId
  ) {
    return notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <StepIndicator currentStep={2} />
      <h1
        className="text-3xl font-bold mb-4"
        aria-label={`Investment Details for ${product.name}`}
      >
        Investment Details
      </h1>
      <InvestmentDetailsForm
        product={product}
        land={land}
        durations={durations}
      />
    </div>
  );
}
