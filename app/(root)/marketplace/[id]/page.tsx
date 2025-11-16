"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MarketplaceListing } from "@/types/marketplace";
import { LoadingSpinner } from "@/components/ui/loader";
import {
  ArrowLeft,
  Package,
  User,
  ShoppingCart,
  MapPin,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

interface State {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
  stateId: string;
}

const orderSchema = z.object({
  quantityKg: z.number().min(0.1, "Quantity must be at least 0.1 kg"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  state: z.string().min(1, "State is required"),
  location: z.string().min(1, "Location is required"),
  phoneNumber: z.string().regex(/^\+?[\d\s-()]{10,}$/, "Invalid phone number format"),
  notes: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function ListingDetailPage() {
  const { data: _session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantityKg: 1,
      deliveryAddress: "",
      state: "",
      location: "",
      phoneNumber: "",
      notes: "",
    },
  });

  const quantityKg = watch("quantityKg");

  useEffect(() => {
    fetchListing();
    fetchStates();
  }, [params.id]);

  useEffect(() => {
    if (selectedStateId) {
      fetchLocations(selectedStateId);
    } else {
      setLocations([]);
    }
  }, [selectedStateId]);

  const fetchStates = async () => {
    try {
      const response = await axios.get("/api/states");
      setStates(response.data);
    } catch (_error) {
      toast.error("Failed to fetch states");
    }
  };

  const fetchLocations = async (stateId: string) => {
    try {
      const response = await axios.get(`/api/locations?stateId=${stateId}`);
      setLocations(response.data);
    } catch (_error) {
      toast.error("Failed to fetch locations");
    }
  };

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
    } catch (_error) {
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

      const totalAmount = data.quantityKg * listing.pricePerKg;

      // determine customer info (session preferred)
      const customerName = _session?.user?.name || data.customerName || "Guest";
      const customerEmail = _session?.user?.email || data.customerEmail || "guest@example.com";

      // Initialize Monnify + create an order on server
      const initResp = await fetch('/api/monnify/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          customerName,
          customerEmail,
          customerPhone: data.phoneNumber,
          meta: {
            type: 'marketplace',
            listingId: listing.id,
            quantityKg: data.quantityKg,
          }
        })
      });

      const initJson = await initResp.json();
      if (!initResp.ok) {
        toast.error(initJson.error || 'Failed to initialize payment');
        setSubmitting(false);
        return;
      }

      const { publicKey, paymentReference, amount, orderId, contractCode } = initJson;

      // Try to load Monnify SDK
      await new Promise<void>((resolve) => {
        if ((window as any).Monnify) return resolve();
        const s = document.createElement('script');
        s.src = 'https://sdk.monnify.com/plugin/monnify.js';
        s.onload = () => resolve();
        document.body.appendChild(s);
      });

      // @ts-ignore
      const Monnify = (window as any).Monnify || (window as any).MonnifySDK;

      const finalizeOrder = async () => {
        // After successful payment verification, attach items to existing orderId
        const resp = await axios.post('/api/marketplace/orders', {
          orderId,
          items: [
            { listingId: listing.id, quantityKg: data.quantityKg, pricePerKg: listing.pricePerKg }
          ],
          deliveryAddress: data.deliveryAddress,
          state: data.state,
          location: data.location,
          phoneNumber: data.phoneNumber,
          notes: data.notes,
        });

        if (resp.status === 201) {
          toast.success('Order placed successfully!');
          router.push('/marketplace/orders');
        } else {
          toast.error('Failed to create order after payment');
        }
      };

      if (Monnify) {
        Monnify.initialize({
          amount: amount,
          currency: 'NGN',
          reference: paymentReference,
          customerName: initJson.customerName,
          customerEmail: initJson.customerEmail,
          apiKey: publicKey,
          contractCode: contractCode,
          onComplete: async (response: any) => {
            try {
              const verifyResp = await fetch('/api/monnify/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentReference: response.paymentReference || paymentReference, orderId }),
              });
              const verifyJson = await verifyResp.json();
              if (verifyResp.ok && verifyJson.status === 'PAID') {
                await finalizeOrder();
              } else {
                toast.error('Payment verification failed');
              }
            } catch (err) {
              toast.error('Verification error');
            } finally {
              setSubmitting(false);
            }
          },
          onClose: () => {
            setSubmitting(false);
          }
        });
      } else {
        // SDK not available - try server-side verify (dev fallback)
        const verifyResp = await fetch('/api/monnify/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentReference, orderId }),
        });
        const verifyJson = await verifyResp.json();
        if (verifyResp.ok && verifyJson.status === 'PAID') {
          await finalizeOrder();
        } else {
          toast.error('Payment verification failed');
        }
        setSubmitting(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to place order");
    } finally {
      // setSubmitting is toggled in callbacks
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-[#1E7B47] hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={listing.product?.images?.[0] || "/images/farm.jpg"}
                    alt={listing.product?.name || "Product"}
                    fill
                    className="object-cover"
                  />
                  {listing.isNegotiable && (
                    <Badge className="absolute top-4 right-4 bg-[#1E7B47] hover:bg-[#145C33] text-white border-0 px-4 py-2">
                      Negotiable
                    </Badge>
                  )}
                  {listing.status === "ACTIVE" && (
                    <div className="absolute top-4 left-4 bg-green-500/90 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Available Now
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h1 className="text-4xl font-bold mb-3 text-gray-900">
                    {listing.product?.name}
                  </h1>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {listing.product?.description}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <User className="h-5 w-5 text-[#1E7B47]" />
                      <div>
                        <p className="text-xs text-gray-500">Sold by</p>
                        <p className="font-semibold text-gray-900">
                          {listing.investment?.user?.name || listing.investor?.name || "Verified Farmer"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Package className="h-5 w-5 text-[#1E7B47]" />
                      <div>
                        <p className="text-xs text-gray-500">Available Quantity</p>
                        <p className="font-semibold text-gray-900">
                          {listing.quantityKg}kg
                        </p>
                      </div>
                    </div>

                    {listing.investment?.land?.location && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-[#1E7B47]" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-semibold text-gray-900">
                            {listing.investment.land.location.name}, {listing.investment.land.location.state?.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Badge className="mb-6 bg-[#E9F6EE] text-[#1E7B47] hover:bg-[#E9F6EE] px-4 py-2 text-sm font-semibold border-0">
                    {listing.product?.ProductType?.name}
                  </Badge>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600 text-lg">Price per kg</span>
                      <span className="text-3xl font-bold text-[#1E7B47]">
                        ₦{listing.pricePerKg.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <span className="text-gray-700 font-medium">Total value</span>
                      <span className="text-2xl font-bold text-gray-900">
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
            <Card className="sticky top-4 border-0 shadow-lg rounded-2xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-2xl text-gray-900">Place Your Order</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <Label htmlFor="quantityKg" className="text-gray-700 font-medium">Quantity (kg)</Label>
                    <Input
                      id="quantityKg"
                      type="number"
                      step="0.1"
                      max={listing.quantityKg}
                      {...register("quantityKg", { valueAsNumber: true })}
                      placeholder="Enter quantity"
                      className="mt-2 border-gray-300 focus:border-[#1E7B47] focus:ring-[#1E7B47]"
                    />
                    {errors.quantityKg && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.quantityKg.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum available: {listing.quantityKg}kg
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="deliveryAddress" className="text-gray-700 font-medium">Delivery Address</Label>
                    <Input
                      id="deliveryAddress"
                      {...register("deliveryAddress")}
                      placeholder="Enter your delivery address"
                      className="mt-2 border-gray-300 focus:border-[#1E7B47] focus:ring-[#1E7B47]"
                    />
                    {errors.deliveryAddress && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.deliveryAddress.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-gray-700 font-medium">State</Label>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedState = states.find(s => s.name === value);
                            setSelectedStateId(selectedState?.id || "");
                            setValue("location", ""); // Reset location when state changes
                          }}
                        >
                          <SelectTrigger className="mt-2 border-gray-300">
                            <SelectValue placeholder="Select your state" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state.id} value={state.name}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-gray-700 font-medium">Location</Label>
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!selectedStateId || locations.length === 0}
                        >
                          <SelectTrigger className="mt-2 border-gray-300">
                            <SelectValue placeholder={selectedStateId ? "Select your location" : "Select a state first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.id} value={location.name}>
                                {location.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.location && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  <div>
                    {!_session?.user?.id && (
                      <>
                        <Label htmlFor="customerName" className="text-gray-700 font-medium">Your Name</Label>
                        <Input
                          id="customerName"
                          {...register("customerName")}
                          placeholder="Enter your full name"
                          className="mt-2 border-gray-300 focus:border-[#1E7B47] focus:ring-[#1E7B47]"
                        />
                        {errors.customerName && (
                          <p className="text-sm text-red-600 mt-1">{errors.customerName.message}</p>
                        )}

                        <Label htmlFor="customerEmail" className="text-gray-700 font-medium mt-3">Email</Label>
                        <Input
                          id="customerEmail"
                          {...register("customerEmail")}
                          placeholder="Enter your email"
                          type="email"
                          className="mt-2 border-gray-300 focus:border-[#1E7B47] focus:ring-[#1E7B47]"
                        />
                        {errors.customerEmail && (
                          <p className="text-sm text-red-600 mt-1">{errors.customerEmail.message}</p>
                        )}
                      </>
                    )}
                    <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      {...register("phoneNumber")}
                      placeholder="Enter your phone number"
                      type="tel"
                      className="mt-2 border-gray-300 focus:border-[#1E7B47] focus:ring-[#1E7B47]"
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-gray-700 font-medium">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      {...register("notes")}
                      placeholder="Any special instructions"
                      className="mt-2 border-gray-300 focus:border-[#1E7B47] focus:ring-[#1E7B47]"
                    />
                  </div>

                  <div className="p-5 bg-green-50 rounded-xl space-y-3 border border-green-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">
                        Price per kg
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        ₦{listing.pricePerKg.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 font-medium">
                        Quantity
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {quantityKg}kg
                      </span>
                    </div>
                    <div className="border-t border-green-200 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-[#1E7B47]">
                        ₦{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {listing.status !== "ACTIVE" && (
                    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
                      <p className="text-sm text-yellow-800 font-medium">
                        ⚠️ This listing is currently not active
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#1E7B47] hover:bg-[#145C33] text-white font-semibold py-6 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={submitting || listing.status !== "ACTIVE"}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {submitting ? "Placing Order..." : "Place Order Now"}
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
