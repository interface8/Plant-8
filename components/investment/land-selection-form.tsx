"use client";

import Image from "next/image";
import { useState } from "react";
import { Land } from "@/types/land";
import { State } from "@/types/state";

interface LandSelectionFormProps {
  lands: Land[];
  states: State[];
  initialState?: string;
  onLandSelect?: (landId: string) => void;
}

export default function LandSelectionForm({
  lands,
  states,
  initialState,
  onLandSelect,
}: LandSelectionFormProps) {
  const [stateFilter, setStateFilter] = useState(initialState || "");

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStateFilter(e.target.value);
  };

  const filteredLands = stateFilter
    ? lands.filter((land) => land.location.state.name === stateFilter)
    : lands;

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="stateFilter"
          className="block text-sm font-medium text-gray-700"
        >
          Filter by State
        </label>
        <select
          id="stateFilter"
          name="state"
          value={stateFilter}
          onChange={handleStateChange}
          className="mt-1 block w-full max-w-xs border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">All States</option>
          {states.map((state) => (
            <option key={state.id} value={state.name}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {filteredLands.map((land) => (
          <div key={land.id} className="border rounded-md p-4">
            <Image
              src={land.imageUrl || "/placeholder-image.jpg"}
              alt={`${land.name} in ${land.location.name}`}
              width={320}
              height={180}
              className="w-full h-48 object-cover rounded-md mb-4"
              placeholder="blur"
              blurDataURL="/placeholder-image-blur.jpg"
            />
            <h2 className="text-lg font-semibold">{land.name}</h2>
            <p className="text-gray-600 mb-2">
              {land.location.name}, {land.location.state.name}
            </p>
            {land.gpsCoordinates && (
              <p className="text-sm text-gray-500 mb-2">
                GPS: {land.gpsCoordinates}
              </p>
            )}
            <p className="text-sm text-gray-500">
              Half Plot: ₦{land.halfPlotPrice.toLocaleString()} | Full Plot: ₦
              {land.fullPlotPrice.toLocaleString()}
            </p>
            <button
              onClick={() => onLandSelect?.(land.id)}
              className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              aria-label={`Select ${land.name} for investment`}
            >
              Select This Land
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
