"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
// import { Separator } from "../ui/separator";
// import { Progress } from "../ui/progress";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Maximize,
  CheckCircle2,
  Clock,
} from "lucide-react";
// Removed: ChevronLeft, ChevronRight

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    currentMarketPricePerKg: number;
    farmerMonthlyPayment: number;
    ProductType: { id: string; name: string };
    duration: { id: string; name: string };
    investments?: { id: string; expectedReturn?: number | null; amount?: number }[];
    // Add more fields as needed
  };
  onBack?: () => void;
}

export default function InvestmentDetail({ product, onBack }: ProductDetailProps) {
  // For demo, use a single image. Replace with carousel if you add more images.
  const images = [product.imageUrl];

  // Example: You can add more logic for highlights, payoutSchedule, etc.
  const highlights = [
    "100% Farm Insurance",
    "Transparent Reporting",
    "Expert Farm Management",
  ];

  // Example: Use the product's market price for min investment and product-specific ROI
  const minInvestment = product.currentMarketPricePerKg * 100;
  const expectedReturn =
    product.investments && product.investments.length > 0
      ? product.investments[0].expectedReturn ?? 15
      : 15;
  const [investmentAmount, setInvestmentAmount] = useState(minInvestment);
  const estimatedReturn = (investmentAmount * expectedReturn) / 100;
  const totalReturn = investmentAmount + estimatedReturn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9F6EE] via-white to-[#E9F6EE]">
      {/* Header */}
      <div className="py-6 px-4" style={{ background: 'linear-gradient(90deg, #1E7B47 0%, #145C33 100%)' }}>
        <div className="max-w-7xl mx-auto">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Investments
            </Button>
          )}
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
            <div className="rounded-lg p-4" style={{ background: '#E9F6EE' }}>
              <p className="text-sm text-[#145C33]/80">Expected Return</p>
              <p className="text-3xl text-[#1E7B47] font-semibold">{expectedReturn}%</p>
              <div className="text-xs text-[#145C33]">Annual yield</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
              <Image
                src={images[0]}
                alt={`${product.name} - Image`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>

            {/* Details */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="mb-3">About This Investment</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                {/* <Separator /> */}
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

                {/* <Separator /> */}
                <hr />

                <div>
                  <h4 className="mb-3">Key Highlights</h4>
                  <div className="space-y-2">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#1E7B47] mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <Separator /> */}
                <hr />

                <div>
                  <h4 className="mb-2">Payout Schedule</h4>
                  <p className="text-muted-foreground">--</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Investment Calculator */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="mb-1">Investment Calculator</h3>
                  <p className="text-sm text-muted-foreground">Calculate your potential returns</p>
                </div>

                {/* <Separator /> */}
                <hr />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="investment-amount" className="text-sm">
                      Investment Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="investment-amount"
                        type="number"
                        min={minInvestment}
                        step={100}
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum: ₦{minInvestment.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-lg p-4 space-y-3" style={{ background: '#F6FBF7' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Your Investment</span>
                      <span>₦{investmentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Expected Return ({expectedReturn}%)</span>
                        <span className="text-[#145C33]">+₦{estimatedReturn.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span>Total Payout</span>
                        <span className="text-xl text-[#1E7B47]">₦{totalReturn.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Investment Progress</span>
                      <span className="text-muted-foreground">--% funded</span>
                    </div>
                    {/* <Progress value={0} className="h-2" /> */}
                  </div>
                </div>

                {/* <Separator /> */}
                <hr />

                <Button className="w-full bg-[#1E7B47] hover:bg-[#145C33] text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Invest Now
                </Button>

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
