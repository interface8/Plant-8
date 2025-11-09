"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui/button";
import { calculateInvestmentROI } from "@/lib/utils/investmentCalculator";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setInvestmentData, setProduct, setLand, setDurationName } from "@/store/slices/investmentSlice";
import { Modal } from "@/components/ui/modal";
import LandSelectionForm from "@/components/investment/land-selection-form";
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

import type { Land } from "@/types/land";
import type { State } from "@/types/state";

interface ProductDetailProps {
  product: Product & {
    investments?: { id: string; expectedReturn?: number | null; amount?: number }[];
  };
  lands?: Land[];
  states?: State[];
  onBack?: () => void;
}

export default function InvestmentDetail({ product, lands = [], states = [], onBack }: ProductDetailProps) {
  const router = useRouter();
  const images = Array.isArray(product.images)
    ? product.images.filter((url) => typeof url === "string" && url.trim() !== "")
    : [];
  const [currentImage, setCurrentImage] = useState(0);
  const hasMultiple = images.length > 1;
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  const highlights = [
    "100% Farm Insurance",
    "Transparent Reporting",
    "Expert Farm Management",
  ];
  const minInvestment = product.currentMarketPricePerKg * 100;
  const expectedReturn = typeof product.roi === 'number' ? product.roi : 15;

  // Redux
  const dispatch = useDispatch();
  const investment = useSelector((state: RootState) => state.investment);

  // Local state for modal
  const [isLandModalOpen, setLandModalOpen] = useState(false);
  const selectedLand = lands.find((l) => l.id === investment.landId) || null;

  // Sync product, land, durationName to redux on mount/land change
  useEffect(() => {
    dispatch(setProduct(product));
    dispatch(setDurationName(product.duration?.name || ""));
    if (selectedLand) {
      dispatch(setLand(selectedLand));
    }
    dispatch(setInvestmentData({
      productId: product.id,
      productTypeId: product.productTypeId,
      durationId: product.durationId,
      landId: selectedLand ? selectedLand.id : "",
      numberOfPlots: investment.numberOfPlots || 1,
      numberOfTerms: investment.numberOfTerms || 1,
      numberOfFarmers: investment.numberOfFarmers || product.minimumNoOfFarmersPerPlot || 1,
      amount: investment.amount || minInvestment,
    }));
    
  }, [product, selectedLand]);

  // Handler for selecting land from modal
  const handleLandSelect = (landId: string) => {
    const landObj = lands.find((l) => l.id === landId) || null;
    if (landObj) {
      dispatch(setLand(landObj));
      dispatch(setInvestmentData({ landId: landObj.id }));
    }
    setLandModalOpen(false);
  };

  // Handlers for input fields
  const handlePlotsChange = (val: number) => {
    dispatch(setInvestmentData({ numberOfPlots: val }));
  };
  const handleFarmersChange = (val: number) => {
    dispatch(setInvestmentData({ numberOfFarmers: val }));
  };
  const handleTermsChange = (val: number) => {
    dispatch(setInvestmentData({ numberOfTerms: val }));
  };

  // Local state for investment amount input
  const [amountInput, setAmountInput] = useState<string>(investment.amount !== undefined && investment.amount !== null ? String(investment.amount) : "");

  // Sync Redux state to local input if investment.amount changes externally
  useEffect(() => {
    setAmountInput(investment.amount !== undefined && investment.amount !== null ? String(investment.amount) : "");
  }, [investment.amount]);

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty string for clearing
    setAmountInput(val);
    // Only dispatch if valid number and >= 0
    const num = Number(val);
    if (val === "") {
      dispatch(setInvestmentData({ amount: 0 })); // Or undefined if you want
    } else if (!isNaN(num) && num >= 0) {
      dispatch(setInvestmentData({ amount: num }));
    }
  } 

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9F6EE] via-white to-[#E9F6EE]">
      {/* Land Selection Modal */}
      <Modal isOpen={isLandModalOpen} onClose={() => setLandModalOpen(false)} title="Select Land">
        <LandSelectionForm lands={lands} states={states} onLandSelect={handleLandSelect} />
      </Modal>
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

          {/* Right column - Calculator and Investment Fields */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="mb-1 font-medium">Investment Calculator</h3>
                  <p className="text-sm text-muted-foreground">Calculate your potential returns</p>
                </div>
                <hr />
                {/* Land Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Land</label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" onClick={() => setLandModalOpen(true)}>
                      {selectedLand ? `${selectedLand.name} (${selectedLand.location.name}, ${selectedLand.location.state.name})` : "Select Land"}
                    </Button>
                    {selectedLand && (
                      <span className="text-xs text-gray-500">{selectedLand.gpsCoordinates ? `GPS: ${selectedLand.gpsCoordinates}` : null}</span>
                    )}
                  </div>
                  {selectedLand && (
                    <div className="mt-2 text-sm text-gray-700">
                      Land Price per Plot: ₦{selectedLand.dailyPrice.toLocaleString()} per day
                    </div>
                  )}
                </div>
                {/* Number of Plots */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Number of Plots</label>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={investment.numberOfPlots || 1}
                    onChange={e => handlePlotsChange(Number(e.target.value))}
                    className="w-full border border-border rounded-lg px-3 py-2"
                  />
                </div>
                {/* Number of Farmers */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Number of Farmers</label>
                  <input
                    type="number"
                    min={product.minimumNoOfFarmersPerPlot || 1}
                    value={investment.numberOfFarmers || product.minimumNoOfFarmersPerPlot || 1}
                    onChange={e => handleFarmersChange(Number(e.target.value))}
                    className="w-full border border-border rounded-lg px-3 py-2"
                  />
                </div>
                {/* Number of Terms */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Number of Terms</label>
                  <input
                    type="number"
                    min={1}
                    value={investment.numberOfTerms || 1}
                    onChange={e => handleTermsChange(Number(e.target.value))}
                    className="w-full border border-border rounded-lg px-3 py-2"
                  />
                </div>

                {/* Land Cost */}
                {selectedLand && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Land Cost</label>
                    <div className="w-full border border-border rounded-lg px-3 py-2 bg-gray-50 flex items-center">
                      ₦{(() => {
                        const roiCalc = calculateInvestmentROI(
                          investment.amount || 0,
                          product,
                          selectedLand,
                          investment.numberOfPlots || 1,
                          investment.numberOfFarmers || product.minimumNoOfFarmersPerPlot || 1,
                          investment.numberOfTerms || 1
                        );
                        return roiCalc.landCost.toLocaleString();
                      })()}
                    </div>
                  </div>
                )}
                {/* Investment Amount */}
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
                      value={amountInput}
                      onChange={handleAmountInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-[#1E7B47]"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimum: ₦{minInvestment.toLocaleString()}
                  </p>
                </div>
                {/* Calculation Results */}
                {selectedLand ? (() => {
                  const roiResult = calculateInvestmentROI(
                    investment.amount || 0,
                    product,
                    selectedLand,
                    investment.numberOfPlots || 1,
                    investment.numberOfFarmers || product.minimumNoOfFarmersPerPlot || 1,
                    investment.numberOfTerms || 1
                  );
                  return (
                    <div className="rounded-lg p-4 space-y-2 bg-[#F6FBF7]">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Cost</span>
                        <span className="text-[#145C33]">₦{roiResult.totalCost?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Estimated Revenue</span>
                        <span className="text-[#145C33]">₦{roiResult.estimatedRevenue?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Net Return</span>
                        <span className="text-[#1E7B47]">₦{roiResult.netReturn?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="rounded-lg p-4 bg-[#F6FBF7] text-center text-gray-400">Select a land to see calculation</div>
                )}
                <hr />
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    router.push("/investments/summary");
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
