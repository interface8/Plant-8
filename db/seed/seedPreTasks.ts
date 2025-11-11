import prisma from "../prisma";

interface Product {
  id: string;
  name: string;
}

interface PreTask {
  id: string;
  title: string;
}

// Generic pre-tasks template that applies to most farming products
const getGenericPreTasks = (productId: string, productName: string) => [
  {
    title: `Land Clearing - ${productName}`,
    description: "Clear the land of debris, rocks, and unwanted vegetation. Ensure proper drainage and access paths.",
    estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    productId,
  },
  {
    title: `Soil Preparation - ${productName}`,
    description: "Test soil quality, till the land, and add necessary amendments. Ensure proper soil pH and nutrient levels.",
    estimatedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    productId,
  },
  {
    title: `Planting/Seeding - ${productName}`,
    description: "Plant seeds or seedlings following recommended spacing and depth. Ensure optimal planting conditions.",
    estimatedCompletionDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
    productId,
  },
  {
    title: `Initial Watering & Irrigation Setup - ${productName}`,
    description: "Establish irrigation system and provide initial watering. Monitor soil moisture levels regularly.",
    estimatedCompletionDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days
    productId,
  },
  {
    title: `Fertilizer Application - ${productName}`,
    description: "Apply organic or chemical fertilizers according to soil test results and crop requirements.",
    estimatedCompletionDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days
    productId,
  },
  {
    title: `Weeding & Pest Control - ${productName}`,
    description: "Remove weeds manually or chemically. Implement pest management strategies to protect crops.",
    estimatedCompletionDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 42 days
    productId,
  },
  {
    title: `Mid-Season Maintenance - ${productName}`,
    description: "Monitor crop health, adjust watering and fertilization as needed. Check for diseases and pests.",
    estimatedCompletionDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    productId,
  },
  {
    title: `Pre-Harvest Preparation - ${productName}`,
    description: "Prepare harvesting equipment and storage facilities. Arrange for labor and transportation.",
    estimatedCompletionDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000), // 80 days
    productId,
  },
  {
    title: `Harvesting - ${productName}`,
    description: "Harvest crops at optimal maturity. Handle produce carefully to minimize damage and ensure quality.",
    estimatedCompletionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    productId,
  },
  {
    title: `Post-Harvest Processing - ${productName}`,
    description: "Clean, sort, grade, and package the harvested produce. Store or transport to market as needed.",
    estimatedCompletionDate: new Date(Date.now() + 95 * 24 * 60 * 60 * 1000), // 95 days
    productId,
  },
];

// Poultry-specific pre-tasks
const getPoultryPreTasks = (productId: string, productName: string) => [
  {
    title: `Poultry House Setup - ${productName}`,
    description: "Prepare poultry house with proper ventilation, lighting, feeding, and watering systems.",
    estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    productId,
  },
  {
    title: `Chick Procurement - ${productName}`,
    description: "Source healthy day-old chicks from certified hatcheries. Ensure proper vaccination records.",
    estimatedCompletionDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    productId,
  },
  {
    title: `Brooding Setup - ${productName}`,
    description: "Set up brooding area with heat lamps and proper temperature control for young chicks.",
    estimatedCompletionDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    productId,
  },
  {
    title: `Feeding Program - ${productName}`,
    description: "Establish feeding schedule with appropriate starter, grower, and finisher feeds.",
    estimatedCompletionDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    productId,
  },
  {
    title: `Vaccination & Health Management - ${productName}`,
    description: "Administer scheduled vaccinations and implement biosecurity measures to prevent diseases.",
    estimatedCompletionDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    productId,
  },
  {
    title: `Growth Monitoring - ${productName}`,
    description: "Monitor bird weight, feed conversion ratio, and overall health. Adjust management as needed.",
    estimatedCompletionDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    productId,
  },
  {
    title: `Market Preparation - ${productName}`,
    description: "Arrange for processing, packaging, and market distribution. Prepare birds for sale.",
    estimatedCompletionDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
    productId,
  },
];

export async function seedPreTasks(
  adminId: string,
  products: Product[]
): Promise<PreTask[]> {
  try {
    console.log("📝 Seeding pre-tasks for all products...");
    
    const createdPreTasks: PreTask[] = [];
    
    // Check if pre-tasks already exist
    const existingCount = await prisma.preTask.count();
    if (existingCount > 0) {
      console.log(`⚠️ PreTasks already exist (${existingCount} tasks), skipping seed`);
      return [];
    }

    for (const product of products) {
      let tasks;
      
      // Check if product is poultry-related
      if (product.name.toLowerCase().includes("poultry") || 
          product.name.toLowerCase().includes("chicken") ||
          product.name.toLowerCase().includes("broiler")) {
        tasks = getPoultryPreTasks(product.id, product.name);
      } else {
        tasks = getGenericPreTasks(product.id, product.name);
      }

      // Create all pre-tasks for this product
      for (const taskData of tasks) {
        const createdPreTask = await prisma.preTask.create({
          data: taskData,
        });
        createdPreTasks.push(createdPreTask);
      }
      
      console.log(`✅ Created ${tasks.length} pre-tasks for ${product.name}`);
    }
    
    console.log(`✅ Total pre-tasks seeded: ${createdPreTasks.length}`);
    return createdPreTasks;
  } catch (error) {
    console.error("Failed to seed pre-tasks:", error);
    throw error;
  }
}
