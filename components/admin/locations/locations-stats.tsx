"use client";

import { MapPin, Building, BarChart3, Package } from "lucide-react";

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

interface State {
  id: string;
  name: string;
}

interface LocationsStatsProps {
  locations: Location[];
  states: State[];
}

export default function LocationsStats({ locations }: LocationsStatsProps) {
  const totalLocations = locations.length;
  const totalLands = locations.reduce((sum, location) => sum + location._count.lands, 0);
  const avgLandsPerLocation = totalLocations > 0 ? (totalLands / totalLocations).toFixed(1) : "0";
  
  // Group locations by state
  const locationsByState = locations.reduce((acc, location) => {
    acc[location.state.name] = (acc[location.state.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      name: "Total Locations",
      value: totalLocations.toString(),
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "States with Locations",
      value: Object.keys(locationsByState).length.toString(),
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Total Lands",
      value: totalLands.toString(),
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "Avg. Lands/Location",
      value: avgLandsPerLocation,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      
      {totalLocations > 0 && (
        <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Location Distribution by State</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(locationsByState)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([stateName, count]) => (
                <div key={stateName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{stateName}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {count} location{count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
          </div>
          
          {Object.keys(locationsByState).length > 6 && (
            <p className="text-sm text-gray-500 mt-3">
              And {Object.keys(locationsByState).length - 6} more state{Object.keys(locationsByState).length - 6 !== 1 ? 's' : ''}...
            </p>
          )}
        </div>
      )}
    </div>
  );
}