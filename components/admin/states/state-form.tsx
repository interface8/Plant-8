"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin } from "lucide-react";

export default function StateForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loadingToast = toast.loading("Creating state...");

    try {
      const response = await fetch("/api/admin/states", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("State created successfully!", {
          description: `"${formData.name}" has been added.`,
        });
        
        router.push("/admin/states");
        router.refresh();
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : JSON.stringify(result.error) || "Failed to create state.";
        
        toast.dismiss(loadingToast);
        toast.error("Failed to create state", {
          description: errorMessage,
        });
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: "Failed to create state. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/states");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg border border-green-200">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* State Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            State Name *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="name"
              required
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter state name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Enter the full name of the state (e.g., &ldquo;Lagos&rdquo;, &ldquo;Abuja&rdquo;, &ldquo;Rivers&rdquo;)
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-green-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create State"}
          </button>
        </div>
      </form>
    </div>
  );
}