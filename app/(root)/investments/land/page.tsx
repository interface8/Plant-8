import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getProduct,
  getLands,
  getStates,
} from "@/lib/services/investment-service";
import LandSelectionForm from "@/components/investment/land-selection-form";
import StepIndicator from "@/components/investment/step-indicator";

export const metadata = {
  title: "Select Land - FAM 8",
  description: "Choose a land for your agricultural investment on FAM 8.",
  keywords: "land selection, agricultural investment, FAM 8",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Select Land - FAM 8",
    description: "Choose a land for your agricultural investment on FAM 8.",
    type: "website",
  },
};

export default async function LandSelectionPage({
  searchParams,
}: {
  searchParams: Promise<{
    productId: string;
    productTypeId: string;
    state?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { productId, productTypeId, state } = await searchParams;
  if (!productId || !productTypeId) {
    return notFound();
  }

  const product = await getProduct(productId);
  const lands = await getLands();
  const states = await getStates();
  if (
    !product ||
    !lands ||
    lands.length === 0 ||
    !states ||
    product.productTypeId !== productTypeId
  ) {
    return notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <StepIndicator currentStep={1} />
      <h1
        className="text-3xl font-bold mb-4"
        aria-label={`Select Land for ${product.name}`}
      >
        Select Land for {product.name}
      </h1>
      <LandSelectionForm
        product={product}
        lands={lands}
        states={states}
        initialState={state}
      />
    </div>
  );
}
