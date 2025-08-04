import { notFound, redirect } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import { auth } from "@/auth";
import {
  getProduct,
  getLand,
  getDurations,
} from "@/lib/services/investment-service";

import InvestmentDetailsForm from "@/components/investment/investmentDetailsForm";
import StepIndicator from "@/components/investment/step-indicator";

export default async function InvestmentDetailsPage({
  searchParams,
}: {
  searchParams: { productId: string; productTypeId: string; landId: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { productId, productTypeId, landId } = searchParams;
  if (!productId || !productTypeId || !landId) {
    return notFound();
  }

  const product = await getProduct(productId);
  const land = await getLand(landId);
  const durations = await getDurations();
  if (!product || !land || product.productTypeId !== productTypeId) {
    return notFound();
  }

  return (
    <>
      <Head>
        <title>{`Investment Details for ${product.name} - Agribid`}</title>
        <meta
          name="description"
          content={`Specify investment details for ${product.name} on ${land.name}.`}
        />
        <meta
          name="keywords"
          content={`${product.name}, ${land.location.name}, ${land.location.state.name}, agricultural investment, Agribid`}
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          property="og:title"
          content={`Investment Details for ${product.name} - Agribid`}
        />
        <meta
          property="og:description"
          content={`Specify investment details for ${product.name} on ${land.name}.`}
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
        <StepIndicator currentStep={1} />
        <h1
          className="text-3xl font-bold mb-4"
          aria-label={`Investment Details for ${product.name}`}
        >
          Investment Details
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
            <h2 className="text-xl font-semibold mb-2">Selected Land</h2>
            <p className="text-gray-600 mb-4">
              {land.name}, {land.location.name}, {land.location.state.name}
            </p>
            <InvestmentDetailsForm
              product={product}
              land={land}
              durations={durations}
            />
          </div>
        </div>
      </div>
    </>
  );
}
