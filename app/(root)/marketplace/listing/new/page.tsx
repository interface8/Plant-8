"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, DollarSign } from "lucide-react";
import { suggestListingPrice } from "@/lib/utils/marketplace";

const listingSchema = z.object({
  investmentId: z.string().min(1, "Investment is required"),
  productId: z.string().min(1, "Product is required"),
  quantityKg: z.number().min(1, "Quantity must be at least 1 kg"),
  pricePerKg: z.number().min(1, "Price must be greater than 0"),
  isNegotiable: z.boolean(),
});

type ListingFormData = z.infer<typeof listingSchema>;

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [investments, setInvestments] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      isNegotiable: true,
    },
  });

  const selectedProductId = watch("productId");

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserInvestments();
      fetchProducts();
    }
  }, [status]);

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find((p) => p.id === selectedProductId);
      if (product) {
        const suggested = suggestListingPrice(product, 0.05, 1.1, 5);
        setSuggestedPrice(suggested);
      }
    }
  }, [selectedProductId, products]);

  const fetchUserInvestments = async () => {
    try {
      const response = await axios.get("/api/investments");
      // Filter only completed investments
      const completedInvestments = response.data.filter(
        (inv: any) => inv.status === "COMPLETED" && inv.userId === session?.user?.id
      );
      setInvestments(completedInvestments);
    } catch (error) {
      toast.error("Failed to fetch investments");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const onSubmit = async (data: ListingFormData) => {
    try {
      setLoading(true);
      await axios.post("/api/marketplace/listings", data);
      toast.success("Listing created successfully!");
      router.push("/marketplace/my-listings");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Listing</CardTitle>
            <p className="text-muted-foreground">
              List your harvest on the marketplace
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Investment Selection */}
              <div>
                <Label htmlFor="investmentId">Select Investment</Label>
                <Select
                  onValueChange={(value: string) => setValue("investmentId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an investment" />
                  </SelectTrigger>
                  <SelectContent>
                    {investments.map((investment) => (
                      <SelectItem key={investment.id} value={investment.id}>
                        {investment.product?.name} - {investment.numberOfPlots}{" "}
                        plots
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.investmentId && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.investmentId.message}
                  </p>
                )}
              </div>

              {/* Product Selection */}
              <div>
                <Label htmlFor="productId">Product</Label>
                <Select
                  onValueChange={(value: string) => setValue("productId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productId && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.productId.message}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <Label htmlFor="quantityKg">Quantity (kg)</Label>
                <Input
                  id="quantityKg"
                  type="number"
                  step="0.1"
                  {...register("quantityKg", { valueAsNumber: true })}
                  placeholder="Enter quantity in kg"
                />
                {errors.quantityKg && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.quantityKg.message}
                  </p>
                )}
              </div>

              {/* Price per kg */}
              <div>
                <Label htmlFor="pricePerKg">Price per kg (₦)</Label>
                {suggestedPrice && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      Suggested price: ₦{suggestedPrice.toLocaleString()}
                    </span>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() =>
                        setValue("pricePerKg", suggestedPrice)
                      }
                      className="h-auto p-0"
                    >
                      Use this
                    </Button>
                  </div>
                )}
                <Input
                  id="pricePerKg"
                  type="number"
                  step="0.01"
                  {...register("pricePerKg", { valueAsNumber: true })}
                  placeholder="Enter price per kg"
                />
                {errors.pricePerKg && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.pricePerKg.message}
                  </p>
                )}
              </div>

              {/* Negotiable */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isNegotiable"
                  {...register("isNegotiable")}
                  className="w-4 h-4 rounded border-border"
                />
                <Label htmlFor="isNegotiable" className="cursor-pointer">
                  Price is negotiable
                </Label>
              </div>

              {/* Total Value Preview */}
              {watch("quantityKg") && watch("pricePerKg") && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Total listing value
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    ₦
                    {(
                      watch("quantityKg") * watch("pricePerKg")
                    ).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Listing"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
