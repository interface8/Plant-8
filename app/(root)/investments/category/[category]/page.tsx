"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { ProductType } from "@/types/product";
import { Leaf, Clock, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [crops, setCrops] = useState<ProductType[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCropsByCategory = async () => {
      try {
        // First get the category ProductType (like "Cereals")
        const categoryName = category.replace("-", " ");
        console.log("Fetching category:", categoryName);

        const categoryResponse = await fetch(
          `/api/product-types?name=${encodeURIComponent(
            categoryName
          )}&category=Category`
        );
        const categoryData = await categoryResponse.json();
        console.log("Category data:", categoryData);

        if (categoryData.length > 0) {
          setCategoryInfo(categoryData[0]);
          const categoryId = categoryData[0].id;

          // Get all crops that have this category as parent (prevId = categoryId)
          const cropsResponse = await fetch(
            `/api/product-types?parentId=${categoryId}`
          );
          const cropsData = await cropsResponse.json();
          console.log("Crops data:", cropsData);
          setCrops(cropsData);
        }
      } catch (error) {
        console.error("Error fetching crops by category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCropsByCategory();
  }, [category]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const categoryName = category.replace("-", " ");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {categoryName}
          </h1>
        </div>
        {categoryInfo && (
          <p className="text-gray-600">{categoryInfo.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <div className="h-48 bg-gray-200 relative">
              {crop.productsByType &&
              crop.productsByType.length > 0 &&
              crop.productsByType[0].imageUrl ? (
                <Image
                  src={crop.productsByType[0]?.imageUrl || "/placeholder.svg"}
                  alt={crop.name}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Leaf className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {crop.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {crop.description}
              </p>

              <div className="space-y-2 mb-4">
                {crop.growthDuration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {crop.growthDuration}
                    </span>
                  </div>
                )}
                {crop.expectedReturnRate && (
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">
                      {(crop.expectedReturnRate * 100).toFixed(1)}% Expected
                      Return
                    </span>
                  </div>
                )}
                {crop.productsByType && crop.productsByType.length > 0 && (
                  <div className="text-sm text-gray-600">
                    ${crop.productsByType[0].currentMarketPricePerKg}/kg
                  </div>
                )}
              </div>

              <Link
                href={`/investments/crop/${crop.id}`}
                className="block w-full bg-green-600 text-white text-center py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                View Details & Invest
              </Link>
            </div>
          </div>
        ))}
      </div>

      {crops.length === 0 && (
        <div className="text-center py-12">
          <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No crops found
          </h3>
          <p className="text-gray-600">
            No crops are available in this category.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Debug info:</p>
            <p>Category: {categoryName}</p>
            <p>Category Info: {categoryInfo ? "Found" : "Not found"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
