export interface State {
  id: string;
  name: string;
  locations: { id: string; name: string }[];
}

export interface Location {
  id: string;
  name: string;
  stateId: string;
  state?: { id: string; name: string };
}

export interface Land {
  id: string;
  name: string;
  gpsCoordinates: string | null;
  dailyPrice: number;
  imageUrl: string | null;
  fertilizerCostPerPlot: number;
  inspectionDailyFee: number;
  locationId: string;
  inflationRate: number;
  location: {
    id: string;
    name: string;
    state: {
      id: string;
      name: string;
    };
  };
}
