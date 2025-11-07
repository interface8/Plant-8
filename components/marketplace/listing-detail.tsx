"use client";

import { useState } from "react";
import { MarketplaceListing } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  Star,
  Shield,
  Truck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";

interface ListingDetailProps {
  listing: MarketplaceListing;
  onBack: () => void;
  onAddToCart: (listing: MarketplaceListing, quantity: number) => void;
}

export function ListingDetail({ listing, onBack, onAddToCart }: ListingDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(10);

  const images = listing.product?.images || ["/images/farm.jpg"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const totalCost = quantity * listing.pricePerKg;

  const handleAddToCart = () => {
    onAddToCart(listing, quantity);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-primary-foreground hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{listing.product?.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" />
                <span>{listing.investment?.user?.name || listing.investor?.name || "Verified Farmer"}</span>
              </div>
            </div>
            {listing.marketRating && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{listing.marketRating}</span>
                </div>
                <p className="text-sm text-primary-foreground/80">Market Rating</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
              <Image
                src={images[currentImageIndex]}
                alt={`${listing.product?.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />

              {images.length > 1 && (
                <>
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

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white w-8"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {listing.isNegotiable && (
                <Badge className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-600">
                  Price Negotiable
                </Badge>
              )}
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Product Description</h3>
                  <p className="text-muted-foreground">
                    {listing.description || `Fresh ${listing.product?.name} directly from the farm. High quality produce harvested at peak ripeness for optimal flavor and nutrition.`}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">Available</span>
                    </div>
                    <p className="font-semibold">{listing.quantityKg}kg</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Harvest Date</span>
                    </div>
                    <p className="font-semibold text-sm">
                      {new Date(listing.harvestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Expiry Date</span>
                    </div>
                    <p className="font-semibold text-sm">
                      {listing.expiryDate ? new Date(listing.expiryDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span className="text-sm">Status</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {listing.status}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Quality Assurance</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">Freshly harvested produce</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">Quality checked and certified</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">Secure packaging and delivery</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Purchase Details</h3>
                  <p className="text-sm text-muted-foreground">Select quantity and add to cart</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Price per kg</p>
                    <p className="text-3xl font-bold text-primary">
                      ₦{listing.pricePerKg.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="quantity" className="text-sm font-medium">
                      Quantity (kg)
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <input
                        id="quantity"
                        type="number"
                        min={1}
                        max={listing.quantityKg}
                        value={quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Math.min(listing.quantityKg, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="w-full text-center border border-border rounded-lg px-4 py-2 bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.min(listing.quantityKg, quantity + 1))}
                        disabled={quantity >= listing.quantityKg}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Maximum: {listing.quantityKg}kg available
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Quantity</span>
                      <span className="font-medium">{quantity}kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Price per kg</span>
                      <span className="font-medium">₦{listing.pricePerKg.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Cost</span>
                      <span className="text-xl font-bold text-primary">
                        ₦{totalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {listing.status === "ACTIVE" ? (
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" size="lg" disabled>
                    Currently Unavailable
                  </Button>
                )}

                <div className="bg-accent/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <span className="text-sm">Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">Quality Guaranteed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
