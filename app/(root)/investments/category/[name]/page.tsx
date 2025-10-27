import { notFound } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {
  getCategoryAndProducts,
  getCategoryStaticParams,
} from "@/lib/services/category-service";

export const generateStaticParams = getCategoryStaticParams;

export const revalidate = 60;
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { category, products } = await getCategoryAndProducts(
    (
      await params
    ).name
  );
  if (!category) return notFound();

  return (
    <>
      <Head>
        <title>{`${category.name} Investment Options - FAM 8`}</title>
        <meta name="description" content={category.description} />
        <meta
          name="keywords"
          content={`${category.name}, agricultural investments, FAM 8`}
        />
      </Head>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{category.name} Investments</h1>
        <p className="text-gray-600 mb-6">{category.description}</p>
        {products.length === 0 ? (
          <p className="text-gray-500">No products found for this category.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {products.map((product) => (
              <li
                key={product.id}
                className="border rounded-md p-4 hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/investments/product/${product.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}-${product.id}`}
                  className="block"
                  aria-label={`View details for ${product.name} investment`}
                >
                  <Image
                    src={(product.images && product.images[0]) || "/images/farm.jpg"}
                    alt={`${product.name} investment`}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />

                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-gray-600 text-sm mt-2">
                    {product.description}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Category: {product.ProductType.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Duration: {product.duration.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Market Price: ₦{product.currentMarketPricePerKg.toFixed(2)}
                    /kg
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
