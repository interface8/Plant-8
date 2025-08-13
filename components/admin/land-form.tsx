"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { landSchema } from "@/lib/validators/land-schema-validators";

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
    halfPlotPrice: "",
    fullPlotPrice: "",
    imageUrl: "",
    locationId: locations[0]?.id || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      status !== "authenticated" ||
      !session?.user?.roles?.includes("ADMIN")
    ) {
      setError("You must be an admin to create a land.");
      return;
    }

    const parsedData = {
      ...formData,
      halfPlotPrice: parseFloat(formData.halfPlotPrice),
      fullPlotPrice: parseFloat(formData.fullPlotPrice),
    };

    const parsed = landSchema.safeParse(parsedData);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        throw new Error("Failed to create land");
      }

      router.push("/admin/lands?success=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create land");
      setIsSubmitting(false);
    }
  };

  if (status !== "authenticated" || session?.user?.roles?.includes("ADMIN")) {
    return <p className="text-red-500">Access denied. Admins only.</p>;
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
          htmlFor="halfPlotPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Half Plot Price (₦)
        </label>
        <input
          type="number"
          id="halfPlotPrice"
          value={formData.halfPlotPrice}
          onChange={(e) =>
            setFormData({ ...formData, halfPlotPrice: e.target.value })
          }
          min="0"
          step="1000"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="fullPlotPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Full Plot Price (₦)
        </label>
        <input
          type="number"
          id="fullPlotPrice"
          value={formData.fullPlotPrice}
          onChange={(e) =>
            setFormData({ ...formData, fullPlotPrice: e.target.value })
          }
          min="0"
          step="1000"
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
