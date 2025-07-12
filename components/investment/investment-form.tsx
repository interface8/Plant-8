"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInvestments } from "@/hooks/use-investment";
import type { Product, ProductType } from "@/types/investment";
import { DollarSign, TrendingUp, Calculator } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";

interface InvestmentFormProps {
  product: Product & { type?: ProductType };
  productType?: ProductType;
}

export function InvestmentForm({ product, productType }: InvestmentFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { createInvestment } = useInvestments();
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get the product type from either the product.type or the productType prop
  const currentProductType = product.type || productType;

  const calculateExpectedReturn = (investmentAmount: number) => {
    if (!currentProductType?.expectedReturnRate) return investmentAmount;
    return investmentAmount * (1 + currentProductType.expectedReturnRate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const investmentAmount = Number.parseFloat(amount);
    if (!investmentAmount || investmentAmount <= 0) {
      setError("Please enter a valid investment amount");
      return;
    }

    if (investmentAmount < 100) {
      setError("Minimum investment amount is $100");
      return;
    }

    if (!currentProductType) {
      setError("Product type information is missing");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createInvestment({
        productId: product.id,
        productTypeId: currentProductType.id,
        amount: investmentAmount,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create investment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const investmentAmount = Number.parseFloat(amount) || 0;
  const expectedReturn = calculateExpectedReturn(investmentAmount);
  const profit = expectedReturn - investmentAmount;

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Investment Successful!
            </h3>
            <p className="text-gray-600 mb-4">
              Your investment of {formatCurrency(investmentAmount)} has been
              created successfully.
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span>Invest in {product.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Investment Amount</Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                min="100"
                step="0.01"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Minimum investment: $100
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isSubmitting || !amount}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Processing Investment...
              </>
            ) : (
              "Invest Now"
            )}
          </Button>
        </form>

        {/* Investment Calculator */}
        {investmentAmount > 0 && currentProductType && (
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                Investment Summary
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Investment Amount:</span>
                <span className="font-semibold">
                  {formatCurrency(investmentAmount)}
                </span>
              </div>

              {currentProductType.expectedReturnRate && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Return:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(expectedReturn)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Profit:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(profit)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Return Rate:</span>
                    <span className="font-semibold">
                      {(currentProductType.expectedReturnRate * 100).toFixed(1)}
                      %
                    </span>
                  </div>
                </>
              )}

              {currentProductType.growthDuration && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">
                    {currentProductType.growthDuration}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
