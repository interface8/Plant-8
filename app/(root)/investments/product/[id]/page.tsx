import { notFound } from "next/navigation";
import Head from "next/head";

import InvestmentDetail from "@/components/investment/InvestmentDetail";
import { getProduct, getProductStaticParams } from "@/lib/services/product-service";
import { getLands, getStates } from "@/lib/services/investment-service";
import { BlogService } from "@/lib/services/blogService";
import RelatedBlogs from "@/components/blog/related-blogs";

export const generateStaticParams = getProductStaticParams;

export const revalidate = 10;
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

  // Fetch all lands and states for modal land selection
  const [lands, states] = await Promise.all([
    getLands(),
    getStates(),
  ]);

  // Fetch related blogs for this product
  const relatedBlogs = await BlogService.getBlogs(
    { productId: product.id, status: "PUBLISHED" },
    1,
    3
  );

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
          content={(product.images && product.images[0]) || "/placeholder-image.jpg"}
        />
        <meta property="og:type" content="website" />
      </Head>
      <div>
        <InvestmentDetail product={product} lands={lands} states={states} />
        {relatedBlogs.blogs.length > 0 && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <RelatedBlogs blogs={relatedBlogs.blogs} title={`Articles about ${product.name}`} />
          </div>
        )}
      </div>
    </>
  );
}
