"use client";

import { MapPin, Building, BarChart3 } from "lucide-react";

interface State {
  id: string;
  name: string;
  _count: {
    locations: number;
  };
}

interface StatesStatsProps {
  states: State[];
}

export default function StatesStats({ states }: StatesStatsProps) {
  const totalStates = states.length;
  const totalLocations = states.reduce((sum, state) => sum + state._count.locations, 0);
  const avgLocationsPerState = totalStates > 0 ? (totalLocations / totalStates).toFixed(1) : "0";
  
  // Find state with most locations
  const stateWithMostLocations = states.reduce((max, state) => 
    state._count.locations > max._count.locations ? state : max, 
    { name: "N/A", _count: { locations: 0 } }
  );

  const stats = [
    {
      name: "Total States",
      value: totalStates.toString(),
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Total Locations",
      value: totalLocations.toString(),
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Avg. Locations/State",
      value: avgLocationsPerState,
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
      
      {totalStates > 0 && (
        <div className="md:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">State with Most Locations</h3>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-900 font-medium">
              {stateWithMostLocations.name}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              ({stateWithMostLocations._count.locations} location{stateWithMostLocations._count.locations !== 1 ? 's' : ''})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}