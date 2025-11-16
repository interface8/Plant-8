"use client";

import React, { useState } from "react";
import { MarketplaceListing } from "@/types/marketplace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ShoppingCart,
  Star,
  MapPin,
  Package,
  Search,
  Filter,
  TrendingUp,
  Users,
  CheckCircle,
  User,
} from "lucide-react";
import Image from "next/image";

interface MarketplaceProps {
  listings: MarketplaceListing[];
  onListingClick: (listing: MarketplaceListing) => void;
  cartItemCount?: number;
  onViewCart: () => void;
}

export function MarketplaceGrid({
  listings,
  onListingClick,
  cartItemCount = 0,
  onViewCart,
}: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("ACTIVE");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [apiStates, setApiStates] = useState<Array<{id: string, name: string}>>([]);

  // Fetch states from API
  React.useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/states');
        const data = await response.json();
        setApiStates(data);
      } catch (error) {
        console.error('Failed to fetch states:', error);
      }
    };
    fetchStates();
  }, []);

  const categories = ["All", "Tuber", "Maize", "Fruits", "Vegetable", "Grains", "Legumes"];
  const statuses = ["ACTIVE", "PENDING", "SOLD"];
  
  // Use states from API if available, otherwise extract from listings
  const extractedStates = listings
    .map(l => l.investment?.land?.location?.state?.name)
    .filter(Boolean) as string[];
  
  console.log('Listings:', listings.length);
  console.log('Extracted states from listings:', extractedStates);
  console.log('States from API:', apiStates);
  
  // Prioritize API states, fallback to extracted states
  const stateNames = apiStates.length > 0 
    ? apiStates.map(s => s.name)
    : Array.from(new Set(extractedStates));
    
  const states = ["All", ...stateNames];

  // Get max price for slider
  const maxPrice = Math.max(...listings.map((p) => p.pricePerKg), 10000);

  // Filter listings
  const filteredListings = listings.filter((listing) => {
    const investorName = listing.investment?.user?.name || listing.investor?.name || "";
    const matchesSearch =
      listing.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || listing.product?.ProductType?.name === selectedCategory;
    const matchesStatus = listing.status === selectedStatus;
    const matchesPrice =
      listing.pricePerKg >= priceRange[0] && listing.pricePerKg <= priceRange[1];
    const matchesState =
      selectedState === "All" || listing.investment?.land?.location?.state?.name === selectedState;

    return matchesSearch && matchesCategory && matchesStatus && matchesPrice && matchesState;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.pricePerKg - b.pricePerKg;
      case "price-high":
        return b.pricePerKg - a.pricePerKg;
      case "quantity":
        return b.quantityKg - a.quantityKg;
      case "featured":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <Label>Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* State Filter */}
      <div>
        <Label className="text-gray-700 font-medium">State</Label>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="mt-2 border-gray-300">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div>
        <Label>Status</Label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div>
        <Label>Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Latest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="quantity">Quantity Available</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSearchQuery("");
          setSelectedCategory("All");
          setSelectedState("All");
          setSelectedStatus("ACTIVE");
          setPriceRange([0, Math.ceil(maxPrice)]);
          setSortBy("featured");
        }}
      >
        Reset Filters
      </Button>
    </div>
  );

  // Calculate stats
  const activeListings = listings.filter(l => l.status === "ACTIVE").length;
  const totalSellers = new Set(listings.map(l => l.investment?.user?.email || l.investor?.name).filter(Boolean)).size;
  const avgPrice = listings.length > 0 
    ? listings.reduce((sum, l) => sum + l.pricePerKg, 0) / listings.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header Section with Stats */}
      <section className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-3">
                Farm Fresh Marketplace
              </h1>
              <p className="text-base sm:text-lg text-green-100 max-w-2xl">
                Buy fresh produce directly from verified farmers and investors
              </p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={onViewCart}
              className="relative bg-white text-green-700 hover:bg-green-50"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Active Listings
                  </p>
                  <p className="text-3xl font-bold">{activeListings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Verified Sellers
                  </p>
                  <p className="text-3xl font-bold">{totalSellers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Avg. Price/kg
                  </p>
                  <p className="text-3xl font-bold">₦{avgPrice.toFixed(0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mt-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search products or investors..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-gray-900"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-4 border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-[#1E7B47]" />
                  <h3 className="font-bold text-gray-900">Filters</h3>
                </div>
                <FilterSection />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters & Sort
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Refine your product search
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSection />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {sortedListings.length} of {listings.length} listings
              </p>
            </div>

            {/* Product Grid */}
            {sortedListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedListings.map((listing) => (
                  <Card
                    key={listing.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white rounded-2xl"
                    onClick={() => onListingClick(listing)}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={
                          listing.product?.images?.[0] ||
                          "/images/farm.jpg"
                        }
                        alt={listing.product?.name || "Product"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {listing.status === "ACTIVE" && (
                        <div className="absolute top-3 left-3 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Available
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6 space-y-4">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h4 className="font-bold text-xl mb-1 text-gray-900 group-hover:text-[#1E7B47] transition-colors leading-tight">
                            {listing.product?.name}
                          </h4>
                          <Badge className="bg-[#E9F6EE] text-[#1E7B47] hover:bg-[#E9F6EE] border-0 text-xs font-semibold shrink-0">
                            {listing.product?.ProductType?.name}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <User className="h-4 w-4 text-[#1E7B47]" />
                          <span className="font-medium truncate">{listing.investment?.user?.name || listing.investor?.name || "Verified Farmer"}</span>
                        </div>
                        {listing.investment?.land?.location && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="truncate">{listing.investment.land.location.name}, {listing.investment.land.location.state?.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {listing.marketRating && (
                          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-gray-900">{listing.marketRating}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 bg-[#E9F6EE] text-[#1E7B47] px-3 py-1.5 rounded-lg">
                          <Package className="h-4 w-4" />
                          <span className="text-sm font-bold">{listing.quantityKg}kg</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Price per kg</p>
                            <p className="text-2xl font-bold text-[#1E7B47]">
                              ₦{listing.pricePerKg.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right flex-1">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Total value</p>
                            <p className="text-lg font-bold text-gray-900">
                              ₦{listing.totalValue.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {listing.isNegotiable && (
                          <div className="text-center">
                            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                              💬 Price Negotiable
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No listings found
                </h3>
                <p className="text-gray-500 text-sm">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
