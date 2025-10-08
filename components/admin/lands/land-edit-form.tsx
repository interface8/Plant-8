"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Building, ArrowLeft } from "lucide-react";

interface Land {
  id: string;
  name: string;
  gpsCoordinates: string | null;
  halfPlotPrice: number;
  fullPlotPrice: number;
  imageUrl: string | null;
  locationId: string;
  location: {
    id: string;
    name: string;
    state: {
      id: string;
      name: string;
    };
  };
}

interface Location {
  id: string;
  name: string;
  state: {
    id: string;
    name: string;
  };
}

interface LandEditFormProps {
  land: Land;
  locations: Location[];
}

export default function LandEditForm({ land, locations }: LandEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: land.name,
    gpsCoordinates: land.gpsCoordinates || "",
    halfPlotPrice: land.halfPlotPrice.toString(),
    fullPlotPrice: land.fullPlotPrice.toString(),
    imageUrl: land.imageUrl || "",
    locationId: land.locationId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loadingToast = toast.loading("Updating land...");

    try {
      const response = await fetch(`/api/admin/lands?id=${land.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          gpsCoordinates: formData.gpsCoordinates || null,
          halfPlotPrice: parseFloat(formData.halfPlotPrice),
          fullPlotPrice: parseFloat(formData.fullPlotPrice),
          imageUrl: formData.imageUrl || null,
          locationId: formData.locationId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Land updated successfully!", {
          description: `"${formData.name}" has been updated.`,
        });
        
        router.push("/admin/lands");
        router.refresh();
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : JSON.stringify(result.error) || "Failed to update land.";
        
        toast.dismiss(loadingToast);
        toast.error("Failed to update land", {
          description: errorMessage,
        });
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: "Failed to update land. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/lands");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleCancel}
              className="mr-3 p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              title="Back to lands"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">Edit Land Details</h2>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Land Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Land Name *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="name"
                required
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter land name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="locationId" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                id="locationId"
                required
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}, {location.state.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Half Plot Price */}
          <div>
            <label htmlFor="halfPlotPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Half Plot Price (₦) *
            </label>
            <input
              type="number"
              id="halfPlotPrice"
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              value={formData.halfPlotPrice}
              onChange={(e) => setFormData({ ...formData, halfPlotPrice: e.target.value })}
            />
          </div>

          {/* Full Plot Price */}
          <div>
            <label htmlFor="fullPlotPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Full Plot Price (₦) *
            </label>
            <input
              type="number"
              id="fullPlotPrice"
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              value={formData.fullPlotPrice}
              onChange={(e) => setFormData({ ...formData, fullPlotPrice: e.target.value })}
            />
          </div>

          {/* GPS Coordinates */}
          <div className="md:col-span-2">
            <label htmlFor="gpsCoordinates" className="block text-sm font-medium text-gray-700 mb-2">
              GPS Coordinates
            </label>
            <input
              type="text"
              id="gpsCoordinates"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 6.5244, 3.3792"
              value={formData.gpsCoordinates}
              onChange={(e) => setFormData({ ...formData, gpsCoordinates: e.target.value })}
            />
            <p className="mt-1 text-sm text-gray-500">
              Optional: Enter latitude and longitude coordinates
            </p>
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <p className="mt-1 text-sm text-gray-500">
              Optional: URL to an image of the land
            </p>
          </div>
        </div>

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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Land"}
          </button>
        </div>
      </form>
    </div>
  );
}