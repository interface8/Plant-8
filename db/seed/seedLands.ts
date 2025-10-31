import prisma from "@/db/prisma";
import { v4 as uuidv4 } from "uuid";

export async function seedLands() {
  try {
    console.log("Starting seeding process for lands...");

    // ===== Seed States =====
    console.log("Seeding states...");
    const stateData = [{ name: "Lagos" }, { name: "Ogun" }, { name: "Oyo" }];

    const states = [];
    for (const state of stateData) {
      const existingState = await prisma.state.findUnique({
        where: { name: state.name },
      });

      if (existingState) {
        console.log(
          `State ${state.name} already exists with ID ${existingState.id}`
        );
        states.push(existingState);
      } else {
        const newState = await prisma.state.create({
          data: {
            id: uuidv4(),
            name: state.name,
          },
        });
        console.log(`Created state ${state.name} with ID ${newState.id}`);
        states.push(newState);
      }
    }

    const stateMap = Object.fromEntries(states.map((s) => [s.name, s.id]));

    // ===== Seed Locations =====
    console.log("Seeding locations...");
    const locationData = [
      { name: "Ikeja", stateId: stateMap["Lagos"] },
      { name: "Ikorodu", stateId: stateMap["Lagos"] },
      { name: "Agege", stateId: stateMap["Lagos"] },
      { name: "Abeokuta", stateId: stateMap["Ogun"] },
      { name: "Ijebu", stateId: stateMap["Ogun"] },
      { name: "Sagamu", stateId: stateMap["Ogun"] },
      { name: "Ibadan", stateId: stateMap["Oyo"] },
    ];

    const locations = [];
    for (const loc of locationData) {
      const existingLoc = await prisma.location.findFirst({
        where: { name: loc.name, stateId: loc.stateId },
      });

      if (existingLoc) {
        console.log(
          `Location ${loc.name} already exists with ID ${existingLoc.id}`
        );
        locations.push(existingLoc);
      } else {
        const newLoc = await prisma.location.create({
          data: {
            id: uuidv4(),
            name: loc.name,
            stateId: loc.stateId,
          },
        });
        console.log(`Created location ${loc.name} with ID ${newLoc.id}`);
        locations.push(newLoc);
      }
    }

    const locationMap = Object.fromEntries(
      locations.map((loc) => [loc.name, loc.id])
    );

    // ===== Clear Lands before Seeding =====
    console.log("Clearing existing lands...");
    await prisma.land.deleteMany();
    console.log("Existing lands cleared.");

    // ===== Seed Lands =====
    console.log("Seeding lands...");
    const landData = [
      {
        name: "Ikeja Farm",
        gpsCoordinates: "6.5244,3.3792",
        halfPlotPrice: 500000,
        fullPlotPrice: 1000000,
        imageUrl: "/images/ikeja-farm.jpg",
        locationId: locationMap["Ikeja"],
        farmerDailyWage: 2000,
        fertilizerCostPerPlot: 15000,
        inspectionDailyFee: 1000,
        inflationRate: 0.12,
      },
      {
        name: "Ikorodu Green",
        gpsCoordinates: "6.6194,3.5105",
        halfPlotPrice: 400000,
        fullPlotPrice: 800000,
        imageUrl: "/images/ikorodu-green.jpg",
        locationId: locationMap["Ikorodu"],
        farmerDailyWage: 1800,
        fertilizerCostPerPlot: 12000,
        inspectionDailyFee: 900,
        inflationRate: 0.10,
      },
      {
        name: "Ikorodu Farmland",
        gpsCoordinates: "6.6194,3.5106",
        halfPlotPrice: 420000,
        fullPlotPrice: 840000,
        imageUrl: "/images/ikorodu-farmland.jpg",
        locationId: locationMap["Ikorodu"],
        farmerDailyWage: 1850,
        fertilizerCostPerPlot: 12500,
        inspectionDailyFee: 950,
        inflationRate: 0.11,
      },
      {
        name: "Agege Fields",
        gpsCoordinates: "6.6156,3.3232",
        halfPlotPrice: 450000,
        fullPlotPrice: 900000,
        imageUrl: "/images/agege-fields.jpg",
        locationId: locationMap["Agege"],
        farmerDailyWage: 2100,
        fertilizerCostPerPlot: 16000,
        inspectionDailyFee: 1100,
        inflationRate: 0.13,
      },
      {
        name: "Abeokuta Plains",
        gpsCoordinates: "7.1475,3.3619",
        halfPlotPrice: 350000,
        fullPlotPrice: 700000,
        imageUrl: "/images/abeokuta-plains.jpg",
        locationId: locationMap["Abeokuta"],
        farmerDailyWage: 1700,
        fertilizerCostPerPlot: 11000,
        inspectionDailyFee: 850,
        inflationRate: 0.09,
      },
      {
        name: "Ijebu Acres",
        gpsCoordinates: "6.8228,3.9212",
        halfPlotPrice: 300000,
        fullPlotPrice: 600000,
        imageUrl: "/images/ijebu-acres.jpg",
        locationId: locationMap["Ijebu"],
        farmerDailyWage: 1600,
        fertilizerCostPerPlot: 10000,
        inspectionDailyFee: 800,
        inflationRate: 0.08,
      },
      {
        name: "Sagamu Farms",
        gpsCoordinates: "6.8500,3.6500",
        halfPlotPrice: 320000,
        fullPlotPrice: 640000,
        imageUrl: "/images/sagamu-farms.jpg",
        locationId: locationMap["Sagamu"],
        farmerDailyWage: 1750,
        fertilizerCostPerPlot: 11500,
        inspectionDailyFee: 870,
        inflationRate: 0.10,
      },
      {
        name: "Ibadan Agro",
        gpsCoordinates: "7.3775,3.9470",
        halfPlotPrice: 380000,
        fullPlotPrice: 760000,
        imageUrl: "/images/ibadan-agro.jpg",
        locationId: locationMap["Ibadan"],
        farmerDailyWage: 1900,
        fertilizerCostPerPlot: 13500,
        inspectionDailyFee: 980,
        inflationRate: 0.12,
      },
    ];

    for (const land of landData) {
      await prisma.land.create({
        data: {
          id: uuidv4(),
          ...land,
        },
      });
      console.log(`Created land ${land.name}`);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default seedLands;
