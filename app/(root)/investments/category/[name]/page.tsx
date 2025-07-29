import { notFound } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import prisma from "@/db/prisma";

async function getCategoryAndProducts(name: string): Promise<{
  category: { id: string; name: string; description: string } | null;
  products: Product[];
}> {
  try {
    const category = await prisma.productType.findFirst({
      where: { name: { equals: name.replace("-", " "), mode: "insensitive" } },
      select: { id: true, name: true, description: true },
    });
    if (!category) return { category: null, products: [] };

    const products = await prisma.product.findMany({
      where: { productTypeId: category.id },
      select: {
        id: true,
        name: true,
        description: true,
        productTypeId: true,
        durationId: true,
        imageUrl: true,
        currentMarketPricePerKg: true,
        ProductType: { select: { id: true, name: true } },
        duration: { select: { id: true, name: true } },
      },
    });

    return { category, products };
  } catch (error) {
    console.error("Error fetching category and products:", error);
    return { category: null, products: [] };
  }
}

export async function generateStaticParams() {
  const categories = await prisma.productType.findMany({
    select: { name: true },
  });
  return categories.map((category) => ({
    name: category.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

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
                    src={product.imageUrl}
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
