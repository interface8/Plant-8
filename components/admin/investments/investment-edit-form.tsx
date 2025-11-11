"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save, AlertCircle, User, Package } from "lucide-react";

interface Investment {
  id: string;
  amount: number;
  expectedReturn: number;
  progress: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "FAILED";
  numberOfPlots: number;
  plotSize: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    name: string;
  };
  productType: {
    id: string;
    name: string;
  };
}

interface InvestmentEditFormProps {
  investment: Investment;
}

export default function InvestmentEditForm({ investment }: InvestmentEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    status: investment.status,
    progress: investment.progress,
    expectedReturn: investment.expectedReturn,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loadingToast = toast.loading("Updating investment...");

    try {
      const response = await fetch(`/api/admin/investments?id=${investment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Investment updated successfully!", {
          description: `Investment for "${investment.user.name}" has been updated.`,
        });
        
        router.push("/admin/investments");
        router.refresh();
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : JSON.stringify(result.error) || "Failed to update investment.";
        
        toast.dismiss(loadingToast);
        toast.error("Failed to update investment", {
          description: errorMessage,
        });
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: "Failed to update investment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/investments");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleCancel}
              className="mr-3 p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              title="Back to investments"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">Edit Investment</h2>
          </div>
        </div>
      </div>

      {/* Investment Overview */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <User className="h-10 w-10 text-gray-400 bg-gray-200 rounded-full p-2" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Investor</h3>
              <p className="text-lg font-semibold text-gray-900">{investment.user.name}</p>
              <p className="text-sm text-gray-600">{investment.user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Package className="h-10 w-10 text-gray-400 bg-gray-200 rounded-full p-2" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Product</h3>
              <p className="text-lg font-semibold text-gray-900">{investment.product.name}</p>
              <p className="text-sm text-gray-600">{investment.productType.name}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="text-sm font-medium text-gray-600">Investment Amount</h4>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(investment.amount)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="text-sm font-medium text-gray-600">Number of Plots</h4>
            <p className="text-xl font-bold text-gray-900">{investment.numberOfPlots}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="text-sm font-medium text-gray-600">Plot Size</h4>
            <p className="text-xl font-bold text-gray-900">{investment.plotSize || "N/A"}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Status Field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Investment Status *
          </label>
          <select
            id="status"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as "PENDING" | "ACTIVE" | "COMPLETED" | "FAILED" })}
          >
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Update the current status of this investment
          </p>
        </div>

        {/* Progress Field */}
        <div>
          <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-2">
            Progress (%) *
          </label>
          <input
            type="number"
            id="progress"
            min="0"
            max="100"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.progress}
            onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
          />
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${formData.progress}%` }}
              ></div>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Current completion progress of the investment
          </p>
        </div>

        {/* Expected Return Field */}
        <div>
          <label htmlFor="expectedReturn" className="block text-sm font-medium text-gray-700 mb-2">
            Expected Return (₦) *
          </label>
          <input
            type="number"
            id="expectedReturn"
            min="0"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.expectedReturn}
            onChange={(e) => setFormData({ ...formData, expectedReturn: parseFloat(e.target.value) || 0 })}
          />
          <p className="mt-1 text-sm text-gray-500">
            Expected return amount for this investment
          </p>
        </div>

        {/* Status Change Warning */}
        {formData.status !== investment.status && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                <strong>Status Change:</strong> Changing from <strong>{investment.status}</strong> to <strong>{formData.status}</strong>.
                This action will affect the investment workflow and notifications.
              </p>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Updating..." : "Update Investment"}
          </button>
        </div>
      </form>
    </div>
  );
}