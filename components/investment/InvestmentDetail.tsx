"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  TrendingUp,
  Maximize,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import type { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product & {
    investments?: { id: string; expectedReturn?: number | null; amount?: number }[];
  };
  onBack?: () => void;
}

export default function InvestmentDetail({ product, onBack }: ProductDetailProps) {
  const router = useRouter();
  const images = Array.isArray(product.images)
    ? product.images.filter((url) => typeof url === "string" && url.trim() !== "")
    : [];

  const [currentImage, setCurrentImage] = useState(0);
  const hasMultiple = images.length > 1;

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const highlights = [
    "100% Farm Insurance",
    "Transparent Reporting",
    "Expert Farm Management",
  ];

  const minInvestment = product.currentMarketPricePerKg * 100;
  // Use product.roi for expected return
  const expectedReturn = typeof product.roi === 'number' ? product.roi : 15;

  const [investmentAmount, setInvestmentAmount] = useState(minInvestment);
  const estimatedReturn = (investmentAmount * expectedReturn) / 100;
  const totalReturn = investmentAmount + estimatedReturn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9F6EE] via-white to-[#E9F6EE]">
      {/* Header */}
      <div
        className="py-6 px-4"
        style={{ background: "linear-gradient(90deg, #1E7B47 0%, #145C33 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack || (() => router.back())}
            className="text-white hover:bg-white/10 mb-4 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Investments
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-medium text-white">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                  {product.ProductType.name}
                </Badge>
                <Badge className="bg-[#E9F6EE] text-[#145C33]">Low Risk</Badge>
              </div>
            </div>
            <div className="rounded-lg p-4 bg-[#E9F6EE]">
              <p className="text-sm text-[#145C33]/80">Expected Return</p>
              <p className="text-3xl text-[#1E7B47] font-semibold">{expectedReturn}%</p>
              <div className="text-xs text-[#145C33]">Annual yield</div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carousel */}
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
              {images.length > 0 ? (
                <>
                  <Image
                    src={images[currentImage]}
                    alt={`${product.name} - Image ${currentImage + 1}`}
                    fill
                    className="object-cover transition-all duration-300"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />

                  {hasMultiple && (
                    <>
                      {/* Prev / Next Buttons */}
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>

                      {/* Dots Indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImage
                                ? "bg-white w-8"
                                : "bg-white/50 hover:bg-white/80"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImage
                        ? "border-[#1E7B47]"
                        : "border-transparent hover:border-[#E9F6EE]"
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      width={200}
                      height={120}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Details */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="mb-3 font-medium">About This Investment</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                <hr />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Location</span>
                    </div>
                    <p>Nigeria</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Maximize className="h-4 w-4" />
                      <span className="text-sm">Farm Size</span>
                    </div>
                    <p>--</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Duration</span>
                    </div>
                    <p>{product.duration.name}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Yield Period</span>
                    </div>
                    <p className="text-sm">--</p>
                  </div>
                </div>

                <hr />

                <div>
                  <h4 className="mb-3 font-medium">Key Highlights</h4>
                  <div className="space-y-2">
                    {highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#1E7B47] mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <hr />

                <div>
                  <h4 className="mb-2 font-medium">Payout Schedule</h4>
                  <p className="text-muted-foreground">--</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Calculator */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="mb-1 font-medium">Investment Calculator</h3>
                  <p className="text-sm text-muted-foreground">Calculate your potential returns</p>
                </div>

                <hr />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="investment-amount" className="text-sm">
                      Investment Amount
                    </label>
                    <div className="relative">
                      {/* Naira sign icon */}
                      <span className="absolute left-3 top-4 -translate-y-1/2 h-4 w-4 text-muted-foreground">₦</span>
                      <input
                        id="investment-amount"
                        type="number"
                        min={minInvestment}
                        step={100}
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-[#1E7B47]"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum: ₦{minInvestment.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-lg p-4 space-y-3 bg-[#F6FBF7]">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Your Investment</span>
                      <span>₦{investmentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Expected Return ({expectedReturn}%)
                      </span>
                      <span className="text-[#145C33]">+₦{estimatedReturn.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span>Total Payout</span>
                      <span className="text-xl text-[#1E7B47]">
                        ₦{totalReturn.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <hr />

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // Navigate to the 3-step investment flow, passing product and amount
                    router.push(
                      `/investments?productId=${product.id}&productTypeId=${product.productTypeId}&amount=${investmentAmount}`
                    );
                  }}
                >
                  <Button type="submit" className="w-full bg-[#1E7B47] hover:bg-[#145C33] text-white">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Invest Now
                  </Button>
                </form>

                <div className="bg-accent/30 rounded-lg p-4 space-y-2">
                  {highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#1E7B47]" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
