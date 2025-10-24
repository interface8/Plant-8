import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import InvestmentStepWrapper from "@/components/investment/investment-step-wrapper";
import {
  getProduct,
  getLands,
  getStates,
  getDurations,
} from "@/lib/services/investment-service";

export default async function InvestmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    productId: string;
    productTypeId: string;
    state?: string;
    amount?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const { productId, productTypeId, state, amount } = params;
  if (!productId || !productTypeId) {
    return notFound();
  }

  const product = await getProduct(productId);
  const lands = await getLands();
  const states = await getStates();
  const durations = await getDurations();
  if (
    !product ||
    product.productTypeId !== productTypeId ||
    !lands.length ||
    !states.length ||
    !durations.length
  ) {
    return notFound();
  }

  return (
    <InvestmentStepWrapper
      product={product}
      lands={lands}
      states={states}
      durations={durations}
      initialState={state}
      initialAmount={amount ? Number(amount) : undefined}
    />
  );
}
