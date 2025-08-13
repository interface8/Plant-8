import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Head from "next/head";
import PaymentForm from "@/components/investment/payment-form";

export default async function PaymentPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <>
      <Head>
        <title>Complete Your Investment Payment - FAM 8</title>
        <meta
          name="description"
          content="Complete the payment for your agricultural investment."
        />
        <meta
          name="keywords"
          content="investment payment, agricultural investments, FAM 8"
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          property="og:title"
          content="Complete Your Investment Payment - Agribid"
        />
        <meta
          property="og:description"
          content="Complete the payment for your agricultural investment."
        />
        <meta property="og:type" content="website" />
      </Head>
      <PaymentForm />
    </>
  );
}
