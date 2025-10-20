import { notFound } from "next/navigation";
import Head from "next/head";
import InvestmentDetail from "@/components/investment/InvestmentDetail";
import { getProduct, getProductStaticParams } from "@/lib/services/product-service";

export const generateStaticParams = getProductStaticParams;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const uuidLength = 36;
  const productId = (await params).id.slice(-uuidLength);

  if (!productId) {
    console.error("No product ID found in URL");
    return notFound();
  }

  const product = await getProduct(productId);
  if (!product) {
    console.error(`Product not found for ID: ${productId}`);
    return notFound();
  }

  return (
    <>
      <Head>
        <title>{`${product.name} Investment - Agribid`}</title>
        <meta name="description" content={product.description} />
        <meta
          name="keywords"
          content={`${product.name}, ${product.ProductType.name}, agricultural investment, ${product.duration.name}, Agribid`}
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content={`${product.name} Investment - Agribid`}
        />
        <meta property="og:description" content={product.description} />
        <meta
          property="og:image"
          content={product.imageUrl || "/placeholder-image.jpg"}
        />
        <meta property="og:type" content="website" />
      </Head>
      <InvestmentDetail product={product} />
    </>
  );
}
