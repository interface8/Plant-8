import { notFound, redirect } from "next/navigation";
import Head from "next/head";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import PaymentForm from "@/components/investment/payment-form";

async function getInvestment(investmentId: string, userId: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(investmentId)) {
    return null;
  }

  try {
    const investment = await prisma.investment.findUnique({
      where: { id: investmentId, userId },
      select: {
        id: true,
        amount: true,
        product: { select: { name: true, imageUrl: true } },
        land: {
          select: {
            name: true,
            location: {
              select: { name: true, state: { select: { name: true } } },
            },
          },
        },
      },
    });
    return investment;
  } catch (error) {
    console.error("Error fetching investment:", error);
    return null;
  }
}

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: { investmentId: string; amount: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { investmentId, amount } = searchParams;
  if (!investmentId || !amount) {
    return notFound();
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return notFound();
  }

  const investment = await getInvestment(investmentId, session.user.id);
  if (!investment || investment.amount !== parsedAmount) {
    return notFound();
  }

  return (
    <>
      <Head>
        <title>{`Payment for ${investment.product.name} Investment - Agribid`}</title>
        <meta
          name="description"
          content={`Complete payment for your ${investment.product.name} investment.`}
        />
        <meta
          name="keywords"
          content={`${investment.product.name}, payment, agricultural investment, Agribid`}
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          property="og:title"
          content={`Payment for ${investment.product.name} Investment - Agribid`}
        />
        <meta
          property="og:description"
          content={`Complete payment for your ${investment.product.name} investment.`}
        />
        <meta
          property="og:image"
          content={investment.product.imageUrl || "/placeholder-image.jpg"}
        />
        <meta property="og:type" content="website" />
      </Head>
      <div className="p-6 max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-4"
          aria-label={`Payment for ${investment.product.name}`}
        >
          Payment
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Investment Details</h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Crop</dt>
                <dd className="text-gray-900">{investment.product.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Land</dt>
                <dd className="text-gray-900">
                  {investment.land?.name}, {investment.land?.location.name},{" "}
                  {investment.land?.location.state.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Total Amount
                </dt>
                <dd className="text-gray-900 font-bold">
                  ₦{investment.amount.toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
          <div>
            <PaymentForm
              investmentId={investmentId}
              amount={investment.amount}
            />
          </div>
        </div>
      </div>
    </>
  );
}
