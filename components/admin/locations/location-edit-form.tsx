"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Building, MapPin } from "lucide-react";

interface State {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
  state: {
    id: string;
    name: string;
  };
  _count: {
    lands: number;
  };
}

interface LocationEditFormProps {
  location: Location;
  states: State[];
}

export default function LocationEditForm({ location, states }: LocationEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: location.name,
    stateId: location.state.id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loadingToast = toast.loading("Updating location...");

    try {
      const response = await fetch(`/api/admin/locations?id=${location.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Location updated successfully!", {
          description: `"${formData.name}" has been updated.`,
        });
        
        router.push("/admin/locations");
        router.refresh();
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : JSON.stringify(result.error) || "Failed to update location.";
        
        toast.dismiss(loadingToast);
        toast.error("Failed to update location", {
          description: errorMessage,
        });
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: "Failed to update location. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/locations");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleCancel}
              className="mr-3 p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              title="Back to locations"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">Edit Location Details</h2>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Location Info */}
        {location._count.lands > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center">
              <Building className="h-5 w-5 text-blue-600 mr-2" />
              <p className="text-sm text-blue-800">
                This location contains <strong>{location._count.lands}</strong> land{location._count.lands !== 1 ? 's' : ''}.
                Updating the location details will not affect existing lands.
              </p>
            </div>
          </div>
        )}

        {/* State Selection */}
        <div>
          <label htmlFor="stateId" className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              id="stateId"
              required
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.stateId}
              onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Choose the state where this location belongs
          </p>
        </div>

        {/* Location Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Location Name *
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="name"
              required
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter location name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Enter the name of the location (e.g., &ldquo;Victoria Island&rdquo;, &ldquo;Ikeja&rdquo;, &ldquo;Surulere&rdquo;)
          </p>
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
            disabled={isLoading || !formData.name.trim() || !formData.stateId}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Location"}
          </button>
        </div>
      </form>
    </div>
  );
}