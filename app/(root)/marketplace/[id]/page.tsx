"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MarketplaceListing } from "@/types/marketplace";
import { LoadingSpinner } from "@/components/ui/loader";
import {
  ArrowLeft,
  MapPin,
  Package,
  DollarSign,
  User,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";

const orderSchema = z.object({
  quantityKg: z.number().min(0.1, "Quantity must be at least 0.1 kg"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function ListingDetailPage() {
  const { data: session, status: sessionStatus } = useSession();
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantityKg: 1,
      deliveryAddress: "",
      notes: "",
    },
  });

  const quantityKg = watch("quantityKg");

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/marketplace/listings");
      const foundListing = response.data.find(
        (l: MarketplaceListing) => l.id === params.id
      );
      if (foundListing) {
        setListing(foundListing);
      } else {
        toast.error("Listing not found");
        router.push("/marketplace");
      }
    } catch (error) {
      toast.error("Failed to fetch listing");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    if (!listing) return;

    if (data.quantityKg > listing.quantityKg) {
      toast.error("Requested quantity exceeds available quantity");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("/api/marketplace/orders", {
        items: [
          {
            listingId: listing.id,
            quantityKg: data.quantityKg,
            pricePerKg: listing.pricePerKg,
          }
        ],
        deliveryAddress: data.deliveryAddress,
        notes: data.notes,
      });
      toast.success("Order placed successfully!");
      router.push("/marketplace/orders");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!listing) {
    return <div>Listing not found</div>;
  }

  const totalPrice = quantityKg * listing.pricePerKg;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <Image
                    src={listing.product?.images?.[0] || "/images/farm.jpg"}
                    alt={listing.product?.name || "Product"}
                    fill
                    className="object-cover"
                  />
                  {listing.isNegotiable && (
                    <Badge className="absolute top-3 right-3 bg-blue-600">
                      Negotiable
                    </Badge>
                  )}
                </div>
                <div className="p-6">
                  <h1 className="text-3xl font-bold mb-2">
                    {listing.product?.name}
                  </h1>
                  <p className="text-muted-foreground mb-4">
                    {listing.product?.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Sold by: {listing.investment?.user?.name || listing.investor?.name || "Verified Farmer"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {listing.quantityKg}kg available
                    </span>
                  </div>

                  <Badge className="mb-4">
                    {listing.product?.ProductType?.name}
                  </Badge>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Price per kg</span>
                      <span className="text-2xl font-bold text-primary">
                        ₦{listing.pricePerKg.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total value</span>
                      <span className="text-xl font-semibold text-green-600">
                        ₦{listing.totalValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Form */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Place Order</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="quantityKg">Quantity (kg)</Label>
                    <Input
                      id="quantityKg"
                      type="number"
                      step="0.1"
                      max={listing.quantityKg}
                      {...register("quantityKg", { valueAsNumber: true })}
                      placeholder="Enter quantity"
                    />
                    {errors.quantityKg && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.quantityKg.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Max: {listing.quantityKg}kg
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Input
                      id="deliveryAddress"
                      {...register("deliveryAddress")}
                      placeholder="Enter your delivery address"
                    />
                    {errors.deliveryAddress && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.deliveryAddress.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      {...register("notes")}
                      placeholder="Any special instructions"
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Price per kg
                      </span>
                      <span className="text-sm font-medium">
                        ₦{listing.pricePerKg.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Quantity
                      </span>
                      <span className="text-sm font-medium">
                        {quantityKg}kg
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-primary">
                        ₦{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {listing.status !== "ACTIVE" && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        This listing is currently not active
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting || listing.status !== "ACTIVE"}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {submitting ? "Placing Order..." : "Place Order"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
