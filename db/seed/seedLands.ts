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
        dailyPrice: 1370, // ~500k/365 days
        imageUrl: "/images/ikeja-farm.jpg",
        locationId: locationMap["Ikeja"],
        fertilizerCostPerPlot: 15000,
        inspectionDailyFee: 1000,
        inflationRate: 0.12,
      },
      {
        name: "Ikorodu Green",
        gpsCoordinates: "6.6194,3.5105",
        dailyPrice: 1096, // ~400k/365 days
        imageUrl: "/images/ikorodu-green.jpg",
        locationId: locationMap["Ikorodu"],
        fertilizerCostPerPlot: 12000,
        inspectionDailyFee: 900,
        inflationRate: 0.10,
      },
      {
        name: "Ikorodu Farmland",
        gpsCoordinates: "6.6194,3.5106",
        dailyPrice: 1151, // ~420k/365 days
        imageUrl: "/images/ikorodu-farmland.jpg",
        locationId: locationMap["Ikorodu"],
        fertilizerCostPerPlot: 12500,
        inspectionDailyFee: 950,
        inflationRate: 0.11,
      },
      {
        name: "Agege Fields",
        gpsCoordinates: "6.6156,3.3232",
        dailyPrice: 1233, // ~450k/365 days
        imageUrl: "/images/agege-fields.jpg",
        locationId: locationMap["Agege"],
        fertilizerCostPerPlot: 16000,
        inspectionDailyFee: 1100,
        inflationRate: 0.13,
      },
      {
        name: "Abeokuta Plains",
        gpsCoordinates: "7.1475,3.3619",
        dailyPrice: 959, // ~350k/365 days
        imageUrl: "/images/abeokuta-plains.jpg",
        locationId: locationMap["Abeokuta"],
        fertilizerCostPerPlot: 11000,
        inspectionDailyFee: 850,
        inflationRate: 0.09,
      },
      {
        name: "Ijebu Acres",
        gpsCoordinates: "6.8228,3.9212",
        dailyPrice: 822, // ~300k/365 days
        imageUrl: "/images/ijebu-acres.jpg",
        locationId: locationMap["Ijebu"],
        fertilizerCostPerPlot: 10000,
        inspectionDailyFee: 800,
        inflationRate: 0.08,
      },
      {
        name: "Sagamu Farms",
        gpsCoordinates: "6.8500,3.6500",
        dailyPrice: 877, // ~320k/365 days
        imageUrl: "/images/sagamu-farms.jpg",
        locationId: locationMap["Sagamu"],
        fertilizerCostPerPlot: 11500,
        inspectionDailyFee: 870,
        inflationRate: 0.10,
      },
      {
        name: "Ibadan Agro",
        gpsCoordinates: "7.3775,3.9470",
        dailyPrice: 1041, // ~380k/365 days
        imageUrl: "/images/ibadan-agro.jpg",
        locationId: locationMap["Ibadan"],
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
