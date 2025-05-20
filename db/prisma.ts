// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Ensure DATABASE_URL is defined
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create Neon adapter directly with the connection string
const adapter = new PrismaNeon({ connectionString });

// Initialize PrismaClient with the Neon adapter
const prismaClient = new PrismaClient({ adapter });

// Prevent multiple PrismaClient instances in development
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Export cached PrismaClient instance
export const prisma =
  globalForPrisma.prisma ??
  prismaClient.$extends({
    // Optional: Add custom Prisma extensions if needed
  });

// Cache PrismaClient in development to avoid reinitialization during hot reload
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
