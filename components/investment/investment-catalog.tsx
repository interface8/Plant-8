"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  TrendingUp, 
  Shield, 
  Package, 
  Filter
} from "lucide-react";

// Props interface
interface ProductType {
  id: string;
  name: string;
  description: string;
}

interface Duration {
  id: string;
  name: string;
  description: string;
}

interface Investment {
  id: string;
  amount: number;
  status: string;
  expectedReturn: number | null;
  land: {
    location: {
      name: string;
      state: {
        name: string;
      };
    };
  } | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  currentMarketPricePerKg: number;
  farmerMonthlyPayment: number;
  roi?: number;
  ProductType: {
    id: string;
    name: string;
  };
  duration: {
    id: string;
    name: string;
  };
  investments: Investment[];
}

interface InvestmentCatalogProps {
  productTypes: ProductType[];
  durations: Duration[];
  products: Product[];
  stats: {
    avgReturn: number;
    insuredPercentage: number;
    totalOptions: number;
    totalInvestments: number;
  };
}

// Helper function to calculate risk level based on expected return
function calculateRiskLevel(expectedReturn: number): "Low" | "Medium" | "High" {
  if (expectedReturn < 15) return "Low";
  if (expectedReturn < 25) return "Medium";
  return "High";
}

export default function InvestmentCatalog({
  productTypes,
  durations,
  products,
  stats,
}: InvestmentCatalogProps) {
  // Get URL params for filters
  const searchParams = useSearchParams();
  const urlDuration = searchParams.get("duration");
  const urlType = searchParams.get("type");

  // Create filter options from real data
  const cropCategories = useMemo(() => ["All", ...productTypes.map((pt) => pt.name)], [productTypes]);
  const durationOptions = useMemo(() => durations.map((d) => d.name), [durations]);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDuration, setSelectedDuration] = useState<string>(
    durationOptions[0] || ""
  );

  // Apply URL params on mount only once
  useEffect(() => {
    if (urlDuration && durationOptions.includes(urlDuration)) {
      setSelectedDuration(urlDuration);
    }
    if (urlType && cropCategories.includes(urlType)) {
      setSelectedCategory(urlType);
    }
  }, [urlDuration, urlType, durationOptions, cropCategories]);

  // Transform products into display format
  const transformedProducts = useMemo(() => {
    return products.map((product) => {
      const totalInvestment = product.investments.reduce(
        (sum, inv) => sum + inv.amount,
        0
      );
  const investorCount = product.investments ? product.investments.length : 0;

      // Get location from first investment's land
      const firstInvestment = product.investments[0];
      const location =
        firstInvestment?.land?.location?.state?.name ||
        firstInvestment?.land?.location?.name ||
        "Nigeria";


      // Use product.roi for expected return
      const productExpectedReturn = typeof product.roi === 'number' ? product.roi : 15;

      // Estimate minimum investment (using market price)
      const minInvestment = product.currentMarketPricePerKg * 100;

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.ProductType.name,
        duration: product.duration.name,
  image: (product.images && product.images[0]) || "/images/farm.jpg",
        minInvestment,
  expectedReturn: productExpectedReturn,
  riskLevel: calculateRiskLevel(productExpectedReturn),
        location,
        totalInvestment,
        investorCount,
        insured: true,
        availableSlots: Math.max(100 - investorCount, 0),
        totalSlots: 100,
      };
    });
  }, [products]);

  // Filter products based on selected category and duration
  const filteredProducts = useMemo(() => {
    return transformedProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesDuration = product.duration === selectedDuration;
      return matchesCategory && matchesDuration;
    });
  }, [transformedProducts, selectedCategory, selectedDuration]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header Section with Stats */}
      <section className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-left mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-3">
              FAM 8
            </h1>
            <p className="text-base sm:text-lg text-green-100 max-w-2xl">
              Invest in sustainable agriculture and grow your wealth
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Avg. Returns
                  </p>
                  <p className="text-3xl font-bold">
                    {stats.avgReturn.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Insured Farms
                  </p>
                  <p className="text-3xl font-bold">
                    {stats.insuredPercentage}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Investment Options
                  </p>
                  <p className="text-3xl font-bold">{stats.totalOptions}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        {/* Crop Type Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#1E7B47]" />
            <h3 className="text-lg font-semibold text-gray-900">
              Filter by Crop Type
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {cropCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? "bg-[#1E7B47] text-white shadow-lg"
                    : "bg-[#E9F6EE] text-[#1E7B47] hover:bg-[#D4EDE0]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Filter - Full Width Horizontal */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Duration
          </h3>
          {/* Clean container with subtle background and rounded edges */}
          <div className="bg-gray-50 p-1 rounded-full border border-gray-200">
            <div className="flex gap-1.5">
              {durationOptions.map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  className={`flex-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedDuration === duration
                      ? "bg-[#1E7B47] text-white shadow-sm"
                      : "bg-transparent text-gray-700 hover:bg-white/50"
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 font-medium">
            Showing {filteredProducts.length} investment
            {filteredProducts.length !== 1 ? "s" : ""} for{" "}
            <span className="text-green-700 font-semibold">
              {selectedCategory === "All" ? "all categories" : selectedCategory}
            </span>{" "}
            in{" "}
            <span className="text-green-700 font-semibold">
              {selectedDuration}
            </span>
          </p>
        </div>

        {/* Investment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 p-6"
              >
                {/* Crop Type Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-[#E9F6EE] text-[#1E7B47] text-sm font-medium px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                {/* Title + Description */}
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Details Section - Side by Side Layout */}
                <div className="mb-4">
                  {/* Duration and Min Investment - Side by Side */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Duration Column */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm">Duration</span>
                      </div>
                      <span className="text-[#1E7B47] font-semibold text-base">
                        {product.duration}
                      </span>
                    </div>

                    {/* Min Investment Column */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <span className="text-sm font-medium">₦</span>
                        <span className="text-sm">Min. Investment</span>
                      </div>
                      <span className="text-[#1E7B47] font-bold text-base">
                        {formatCurrency(product.minInvestment)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expected Return Box */}
                <div className="bg-[#E9F6EE] rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#1E7B47]" />
                    <span className="text-sm text-gray-700 font-medium">
                      Expected Return
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-[#1E7B47] mb-1">
                    {product.expectedReturn.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Annual yield</div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link
                    href={`/investments/product/${product.id}`}
                    className="w-full block bg-[#1E7B47] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:bg-[#145C33] text-center"
                    aria-label={`View details for ${product.name} investment`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="inline-block p-6 bg-green-50 rounded-2xl mb-4">
                <Package className="w-16 h-16 text-green-600 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No investments found
              </h3>
              <p className="text-gray-600">
                Try selecting a different category or duration
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
