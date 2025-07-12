"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { ProductType } from "@/types/product";
import { Clock, TrendingUp } from "lucide-react";

export default function DurationPage() {
  const params = useParams();
  const duration = params.duration as string;
  const [crops, setCrops] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCropsByDuration = async () => {
      try {
        // First get the duration ProductType
        const durationName = duration.replace("-", " ");
        const durationResponse = await fetch(
          `/api/product-types?name=${encodeURIComponent(
            durationName
          )}&category=Duration`
        );
        const durationData = await durationResponse.json();

        if (durationData.length > 0) {
          const durationId = durationData[0].id;

          // Then get all crops with this duration
          const cropsResponse = await fetch(
            `/api/product-types?durationId=${durationId}`
          );
          const cropsData = await cropsResponse.json();
          setCrops(cropsData);
        }
      } catch (error) {
        console.error("Error fetching crops by duration:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCropsByDuration();
  }, [duration]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const durationName = duration.replace("-", " ");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {durationName} Investments
          </h1>
        </div>
        <p className="text-gray-600">
          All crops and livestock with {durationName} growth duration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {crop.name}
            </h3>
            <p className="text-gray-600 mb-4">{crop.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {crop.growthDuration}
                </span>
              </div>
              {crop.expectedReturnRate && (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">
                    {(crop.expectedReturnRate * 100).toFixed(1)}%
                  </span>
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
        ))}
      </div>

      {crops.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No crops found
          </h3>
          <p className="text-gray-600">
            No crops are available for this duration.
          </p>
        </div>
      )}
    </div>
  );
}
