"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Location {
  id: string;
  name: string;
  state: { id: string; name: string };
}

interface LandFormProps {
  locations: Location[];
}

export default function LandForm({ locations }: LandFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    gpsCoordinates: "",
    dailyPrice: "",
    imageUrl: "",
    locationId: locations[0]?.id || "",
    fertilizerCostPerPlot: "",
    inspectionDailyFee: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (status !== "authenticated" || !session?.user?.id) {
      const errorMsg = "Please sign in to create a land.";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsSubmitting(false);
      return;
    }

    if (!session?.user?.roles?.includes("ADMIN")) {
      const errorMsg = "You must be an admin to create a land.";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsSubmitting(false);
      return;
    }

    // Client-side validation
    if (!formData.name.trim()) {
      const errorMsg = "Land name is required.";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsSubmitting(false);
      return;
    }

    if (!formData.locationId) {
      const errorMsg = "Location selection is required.";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsSubmitting(false);
      return;
    }

    if (!formData.dailyPrice) {
      const errorMsg = "Daily price is required.";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsSubmitting(false);
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Creating land...", {
      description: "Please wait while we save your land.",
    });

    const parsedData = {
      ...formData,
      dailyPrice: parseFloat(formData.dailyPrice),
      fertilizerCostPerPlot: parseFloat(formData.fertilizerCostPerPlot),
      inspectionDailyFee: parseFloat(formData.inspectionDailyFee),
      gpsCoordinates: formData.gpsCoordinates || null,
      imageUrl: formData.imageUrl || null,
      createdBy: session.user.id,
    };

    try {
      const response = await fetch("/api/admin/lands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      const result = await response.json();

      if (response.ok && result.land) {
        // Clear form on success
        setFormData({
          name: "",
          gpsCoordinates: "",
          dailyPrice: "",
          imageUrl: "",
          locationId: locations[0]?.id || "",
          fertilizerCostPerPlot: "",
          inspectionDailyFee: "",
        });
        setError(null);
        
        toast.dismiss(loadingToast);
        toast.success("Land created successfully!", {
          description: `"${result.land.name}" has been added to the system.`,
        });
        
        router.push("/admin/lands");
      } else {
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : JSON.stringify(result.error) || "Failed to create land.";
        setError(errorMessage);
        
        toast.dismiss(loadingToast);
        toast.error("Failed to create land", {
          description: errorMessage,
        });
      }
    } catch {
      const errorMsg = "Failed to create land. Please try again.";
      setError(errorMsg);
      
      toast.dismiss(loadingToast);
      toast.error("Network Error", {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status !== "authenticated" || !session?.user?.roles?.includes("ADMIN")) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 font-medium">Access denied. Admins only.</p>
        <p className="text-red-500 text-sm mt-1">
          You need admin privileges to access this page.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Land Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="gpsCoordinates"
          className="block text-sm font-medium text-gray-700"
        >
          GPS Coordinates (Optional)
        </label>
        <input
          type="text"
          id="gpsCoordinates"
          value={formData.gpsCoordinates}
          onChange={(e) =>
            setFormData({ ...formData, gpsCoordinates: e.target.value })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label
          htmlFor="dailyPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Daily Price per Plot (₦)
        </label>
        <input
          type="number"
          id="dailyPrice"
          value={formData.dailyPrice}
          onChange={(e) =>
            setFormData({ ...formData, dailyPrice: e.target.value })
          }
          min="0"
          step="100"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL (Optional)
        </label>
        <input
          type="text"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label htmlFor="fertilizerCostPerPlot" className="block text-sm font-medium text-gray-700">
          Fertilizer Cost Per Plot (₦)
        </label>
        <input
          type="number"
          id="fertilizerCostPerPlot"
          value={formData.fertilizerCostPerPlot}
          onChange={e => setFormData({ ...formData, fertilizerCostPerPlot: e.target.value })}
          min="0"
          step="100"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label htmlFor="inspectionDailyFee" className="block text-sm font-medium text-gray-700">
          Inspection Daily Fee (₦)
        </label>
        <input
          type="number"
          id="inspectionDailyFee"
          value={formData.inspectionDailyFee}
          onChange={e => setFormData({ ...formData, inspectionDailyFee: e.target.value })}
          min="0"
          step="100"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label
          htmlFor="locationId"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <select
          id="locationId"
          value={formData.locationId}
          onChange={(e) =>
            setFormData({ ...formData, locationId: e.target.value })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
          required
        >
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}, {location.state.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-green-600 text-white px-4 py-2 rounded-md ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        } transition-colors`}
        aria-label="Create Land"
      >
        {isSubmitting ? "Creating..." : "Create Land"}
      </button>
    </form>
  );
}
