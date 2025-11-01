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
  halfPlotPrice: number;
  fullPlotPrice: number;
  imageUrl: string | null;
  farmerDailyWage: number;
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
