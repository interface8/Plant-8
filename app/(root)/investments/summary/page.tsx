import { notFound, redirect } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import { auth } from "@/auth";
import {
  getProduct,
  getLand,
  getDuration,
} from "@/lib/services/investment-service";
import InvestmentSummaryForm from "@/components/investment/investmentSummaryForm";
import StepIndicator from "@/components/investment/step-indicator";

export default async function InvestmentSummaryPage({
  searchParams,
}: {
  searchParams: {
    productId: string;
    productTypeId: string;
    landId: string;
    plotSize: string;
    numberOfPlots: string;
    durationId: string;
    numberOfTerms: string;
  };
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
  } = searchParams;
  if (
    !productId ||
    !productTypeId ||
    !landId ||
    !numberOfPlots ||
    !durationId ||
    !numberOfTerms
  ) {
    return notFound();
  }

  const parsedNumberOfPlots = parseInt(numberOfPlots);
  const parsedNumberOfTerms = parseInt(numberOfTerms);
  if (
    isNaN(parsedNumberOfPlots) ||
    parsedNumberOfPlots < 1 ||
    parsedNumberOfPlots > 10 ||
    isNaN(parsedNumberOfTerms) ||
    parsedNumberOfTerms < 1 ||
    parsedNumberOfTerms > 4 ||
    (plotSize && !["HALF", "FULL"].includes(plotSize))
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
    product.productTypeId !== productTypeId ||
    product.durationId !== durationId
  ) {
    return notFound();
  }

  const plotPrice =
    plotSize === "HALF" ? land.halfPlotPrice : land.fullPlotPrice;
  const farmerMonthlyPayment = 10000; // ₦10,000 per month
  const monthsMatch = duration.name.match(/(\d+)\s*month/i);
  const durationMonths = monthsMatch ? parseInt(monthsMatch[1]) : 1; // Default to 1 month if parsing fails
  const plotCost = plotPrice * parsedNumberOfPlots * parsedNumberOfTerms;
  const farmerCost =
    farmerMonthlyPayment * durationMonths * parsedNumberOfTerms;
  const totalAmount = plotCost + farmerCost;
  const expectedReturn = plotCost * 1.2; // 20% return on plot cost

  return (
    <>
      <Head>
        <title>{`Investment Summary for ${product.name} - Agribid`}</title>
        <meta
          name="description"
          content={`Review your investment in ${product.name} on ${land.name}.`}
        />
        <meta
          name="keywords"
          content={`${product.name}, ${land.location.name}, ${land.location.state.name}, investment summary, Agribid`}
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          property="og:title"
          content={`Investment Summary for ${product.name} - Agribid`}
        />
        <meta
          property="og:description"
          content={`Review your investment in ${product.name} on ${land.name}.`}
        />
        <meta
          property="og:image"
          content={
            land.imageUrl || product.imageUrl || "/placeholder-image.jpg"
          }
        />
        <meta property="og:type" content="website" />
      </Head>
      <div className="p-6 max-w-4xl mx-auto">
        <StepIndicator currentStep={2} />
        <h1
          className="text-3xl font-bold mb-4"
          aria-label={`Investment Summary for ${product.name}`}
        >
          Investment Summary
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Image
              src={
                land.imageUrl || product.imageUrl || "/placeholder-image.jpg"
              }
              alt={`${land.name} in ${land.location.name}`}
              width={640}
              height={256}
              className="w-full h-64 object-cover rounded-md"
              priority
              placeholder="blur"
              blurDataURL="/placeholder-image-blur.jpg"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Investment Details</h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Crop</dt>
                <dd className="text-gray-900">{product.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Land</dt>
                <dd className="text-gray-900">
                  {land.name}, {land.location.name}, {land.location.state.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Plot Size</dt>
                <dd className="text-gray-900">{plotSize || "FULL"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Number of Plots
                </dt>
                <dd className="text-gray-900">{parsedNumberOfPlots}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="text-gray-900">{duration.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Number of Terms
                </dt>
                <dd className="text-gray-900">{parsedNumberOfTerms}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Plot Cost</dt>
                <dd className="text-gray-900">₦{plotCost.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Farmer Payment
                </dt>
                <dd className="text-gray-900">
                  ₦{farmerCost.toLocaleString()} (₦10,000/month ×{" "}
                  {durationMonths} months × {parsedNumberOfTerms} terms)
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Total Investment Amount
                </dt>
                <dd className="text-gray-900 font-bold">
                  ₦{totalAmount.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Expected Return
                </dt>
                <dd className="text-gray-900">
                  ₦{expectedReturn.toLocaleString()} (20% on plot cost)
                </dd>
              </div>
            </dl>
            <InvestmentSummaryForm
              productId={productId}
              productTypeId={productTypeId}
              landId={landId}
              plotSize={plotSize}
              numberOfPlots={parsedNumberOfPlots}
              durationId={durationId}
              numberOfTerms={parsedNumberOfTerms}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </div>
    </>
  );
}
