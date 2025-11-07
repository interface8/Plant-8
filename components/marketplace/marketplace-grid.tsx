"use client";

import { useState } from "react";
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
  Truck,
  Search,
  Filter,
  Award,
  Leaf,
} from "lucide-react";
import Image from "next/image";

interface MarketplaceProps {
  listings: MarketplaceListing[];
  onListingClick: (listing: MarketplaceListing) => void;
  cartItemCount: number;
  onViewCart: () => void;
}

export function MarketplaceGrid({
  listings,
  onListingClick,
  cartItemCount,
  onViewCart,
}: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("ACTIVE");
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>("featured");

  const categories = ["All", "Tuber", "Maize", "Fruits", "Vegetable", "Grains", "Legumes"];
  const statuses = ["ACTIVE", "PENDING", "SOLD"];

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

    return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
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
          setSelectedStatus("ACTIVE");
          setPriceRange([0, Math.ceil(maxPrice)]);
          setSortBy("featured");
        }}
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Farm Fresh Marketplace</h1>
              <p className="text-primary-foreground/80">
                Buy fresh produce directly from verified farmers and investors
              </p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={onViewCart}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products or investors..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Filters</h3>
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
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
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
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {listing.isNegotiable && (
                        <Badge className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-600">
                          Negotiable
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-3">
                        <h4 className="font-semibold mb-1">
                          {listing.product?.name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{listing.investment?.user?.name || listing.investor?.name || "Unknown Farmer"}</span>
                        </div>
                      </div>

                      {listing.marketRating && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{listing.marketRating}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          <Package className="h-3 w-3 mr-1" />
                          {listing.quantityKg}kg available
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            ₦{listing.pricePerKg.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">per kg</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600">
                            ₦{listing.totalValue.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Total value</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  No listings found
                </h3>
                <p className="text-muted-foreground text-sm">
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
