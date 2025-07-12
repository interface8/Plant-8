"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import type { ProductType, Product } from "@/types/product";
import {
  Clock,
  TrendingUp,
  DollarSign,
  Leaf,
  ShoppingCart,
} from "lucide-react";

export default function CropDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cropId = params.id as string;

  const [crop, setCrop] = useState<ProductType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);

  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        const response = await fetch(`/api/product-types/${cropId}`);
        const cropData = await response.json();
        console.log("Crop data:", cropData);
        setCrop(cropData);

        const availableProducts = cropData.productsByType || [];
        setProducts(availableProducts);

        // Auto-select first product if available
        if (availableProducts.length > 0) {
          setSelectedProduct(availableProducts[0]);
        }
      } catch (error) {
        console.error("Error fetching crop details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCropDetails();
  }, [cropId]);

  const handleInvestment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!crop || !selectedProduct || !investmentAmount) return;

    setIsInvesting(true);

    try {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productTypeId: crop.id,
          productId: selectedProduct.id,
          amount: Number.parseFloat(investmentAmount),
        }),
      });

      if (response.ok) {
        alert("Investment created successfully!");
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        alert(`Failed to create investment: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating investment:", error);
      alert("Error creating investment");
    } finally {
      setIsInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Crop not found</div>
      </div>
    );
  }

  const expectedReturn = crop.expectedReturnRate
    ? Number.parseFloat(investmentAmount || "0") * (1 + crop.expectedReturnRate)
    : Number.parseFloat(investmentAmount || "0");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Crop Details */}
        <div>
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">{crop.name}</h1>
            </div>
            <p className="text-gray-600 text-lg">{crop.description}</p>
          </div>

          {/* Main Product Image */}
          {selectedProduct && (
            <div className="mb-6">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={selectedProduct.imageUrl || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {crop.growthDuration && (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Growth Duration
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {crop.growthDuration}
                </p>
              </div>
            )}

            {crop.expectedReturnRate && (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">
                    Expected Return
                  </span>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {(crop.expectedReturnRate * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </div>

          {/* Available Products */}
          {products.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Available Products
              </h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition-all ${
                      selectedProduct?.id === product.id
                        ? "border-green-500 bg-green-50"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded"
                          priority
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {product.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">
                            ${product.currentMarketPricePerKg}/kg
                          </span>
                        </div>
                      </div>
                      {selectedProduct?.id === product.id && (
                        <div className="text-green-600">
                          <ShoppingCart className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Investment Form */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Invest in {crop.name}
            </h2>

            {!selectedProduct && products.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  Please select a product to invest in.
                </p>
              </div>
            )}

            <form onSubmit={handleInvestment} className="space-y-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Investment Amount ($)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter amount"
                  min="100"
                  step="0.01"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum investment: $100
                </p>
              </div>

              {investmentAmount && Number.parseFloat(investmentAmount) > 0 && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Investment Summary
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment:</span>
                      <span className="font-medium">
                        ${Number.parseFloat(investmentAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Return:</span>
                      <span className="font-medium text-green-600">
                        ${expectedReturn.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profit:</span>
                      <span className="font-medium text-green-600">
                        $
                        {(
                          expectedReturn - Number.parseFloat(investmentAmount)
                        ).toFixed(2)}
                      </span>
                    </div>
                    {selectedProduct && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product:</span>
                        <span className="font-medium">
                          {selectedProduct.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isInvesting || !investmentAmount || !selectedProduct}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isInvesting ? "Processing..." : "Invest Now"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
