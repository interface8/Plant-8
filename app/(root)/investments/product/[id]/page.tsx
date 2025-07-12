import { Suspense } from "react";
import { notFound } from "next/navigation";
import { InvestmentForm } from "@/components/investment/investment-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, DollarSign, Leaf } from "lucide-react";
import Image from "next/image";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/products/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Details */}
        <div className="space-y-6">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={400}
              className="w-full h-full object-cover rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 text-lg mb-4">{product.description}</p>

            {product.type && (
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Category:</span>
                <Badge variant="outline">{product.type.name}</Badge>
              </div>
            )}
          </div>

          {/* Product Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Market Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(product.currentMarketPricePerKg)}
                  <span className="text-sm font-normal text-gray-600">/kg</span>
                </p>
              </CardContent>
            </Card>

            {product.type?.growthDuration && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Growth Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">
                    {product.type.growthDuration}
                  </p>
                </CardContent>
              </Card>
            )}

            {product.type?.expectedReturnRate && (
              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Expected Return Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {(product.type.expectedReturnRate * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Estimated return on investment over the growth period
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Investment Form */}
        <div className="lg:sticky lg:top-8">
          <Suspense fallback={<div>Loading investment form...</div>}>
            <InvestmentForm product={product} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
