import { notFound } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import { Product } from "@/types/product";
import prisma from "@/db/prisma";

async function getProduct(id: string): Promise<Product | null> {
  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    console.error(`Invalid UUID format: ${id}`);
    return null;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
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
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true },
    });
    return products.map((product) => ({
      id: `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${
        product.id
      }`,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Extract UUID from the end of the slug (last 36 characters for a standard UUID)
  const uuidLength = 36; // Length of a UUID (including hyphens)
  const productId = params.id.slice(-uuidLength);

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
        <title>{`${product.name} Investment - FAM 8`}</title>
        <meta name="description" content={product.description} />
        <meta
          name="keywords"
          content={`${product.name}, ${product.ProductType.name}, agricultural investment, ${product.duration.name}, FAM 8`}
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="p-6 max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-4"
          aria-label={`Investment: ${product.name}`}
        >
          {product.name}
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Image
              src={product.imageUrl || "/placeholder-image.jpg"}
              alt={`${product.name} investment`}
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
            <p className="text-gray-600 mb-4">{product.description}</p>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="text-gray-900">{product.ProductType.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="text-gray-900">{product.duration.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Market Price
                </dt>
                <dd className="text-gray-900">
                  ₦{product.currentMarketPricePerKg.toFixed(2)}/kg
                </dd>
              </div>
            </dl>
            <button
              disabled
              className="mt-6 bg-green-600 text-white px-4 py-2 rounded-md opacity-50 cursor-not-allowed"
              aria-label="Invest in this product (currently disabled)"
            >
              Invest (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// import { Suspense } from "react";
// import { notFound } from "next/navigation";
// import { InvestmentForm } from "@/components/investment/investment-form";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Clock, TrendingUp, DollarSign, Leaf } from "lucide-react";
// import Image from "next/image";

// interface ProductPageProps {
//   params: Promise<{ id: string }>;
// }

// async function getProduct(id: string) {
//   try {
//     const response = await fetch(
//       `${
//         process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
//       }/api/products/${id}`,
//       {
//         cache: "no-store",
//       }
//     );

//     if (!response.ok) return null;
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return null;
//   }
// }

// export default async function ProductPage({ params }: ProductPageProps) {
//   const { id } = await params;
//   const product = await getProduct(id);

//   if (!product) {
//     notFound();
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(amount);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="space-y-6">
//           <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
//             <Image
//               src={product.imageUrl || "/placeholder.svg"}
//               alt={product.name}
//               width={600}
//               height={400}
//               className="w-full h-full object-cover rounded-md"
//               onError={(e) => {
//                 const target = e.target as HTMLImageElement;
//                 target.src = "/placeholder.svg";
//               }}
//             />
//           </div>

//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {product.name}
//             </h1>
//             <p className="text-gray-600 text-lg mb-4">{product.description}</p>

//             {product.type && (
//               <div className="flex items-center space-x-2 mb-4">
//                 <Leaf className="h-5 w-5 text-green-600" />
//                 <span className="text-sm text-gray-600">Category:</span>
//                 <Badge variant="outline">{product.type.name}</Badge>
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
//                   <DollarSign className="h-4 w-4 mr-2" />
//                   Market Price
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {formatCurrency(product.currentMarketPricePerKg)}
//                   <span className="text-sm font-normal text-gray-600">/kg</span>
//                 </p>
//               </CardContent>
//             </Card>

//             {product.type?.growthDuration && (
//               <Card>
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
//                     <Clock className="h-4 w-4 mr-2" />
//                     Growth Duration
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {product.type.growthDuration}
//                   </p>
//                 </CardContent>
//               </Card>
//             )}

//             {product.type?.expectedReturnRate && (
//               <Card className="md:col-span-2">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
//                     <TrendingUp className="h-4 w-4 mr-2" />
//                     Expected Return Rate
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-2xl font-bold text-green-600">
//                     {(product.type.expectedReturnRate * 100).toFixed(1)}%
//                   </p>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Estimated return on investment over the growth period
//                   </p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>

//         <div className="lg:sticky lg:top-8">
//           <Suspense fallback={<div>Loading investment form...</div>}>
//             <InvestmentForm product={product} />
//           </Suspense>
//         </div>
//       </div>
//     </div>
//   );
// }
