import { PrismaClient } from "../app/generated/prisma";

// Create the Prisma client instance and apply the accelerate extension
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Global Prisma client reference
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use the existing Prisma instance or create a new one
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Optional: Set the global reference for development environments to prevent multiple instances
if (process.env.NODE_ENV === "development") {
  globalForPrisma.prisma = prisma;
}
