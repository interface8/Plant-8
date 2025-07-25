import prisma from "../prisma"; // Adjust if db/index.ts exports differently
import crypto from "crypto";

interface Product {
  id: string;
  name: string;
}

interface PreTask {
  id: string;
  title: string;
}

export async function seedPreTasks(
  adminId: string,
  products: Product[]
): Promise<PreTask[]> {
  try {
    const maizeProduct = products.find((p) => p.name === "Maize Grain");
    if (!maizeProduct) throw new Error("Maize product not found");

    const preTasks = [
      {
        id: crypto.randomUUID(),
        title: "Prepare Soil for Maize",
        description: "Till and fertilize soil",
        estimatedCompletionDate: new Date("2025-08-01"),
        productId: maizeProduct.id,
      },
    ];

    const createdPreTasks: PreTask[] = [];
    for (const preTask of preTasks) {
      const createdPreTask = await prisma.preTask.create({
        data: preTask,
      });
      createdPreTasks.push(createdPreTask);
    }
    return createdPreTasks;
  } catch (error) {
    console.error("Failed to seed pre-tasks:", error);
    throw error;
  }
}
