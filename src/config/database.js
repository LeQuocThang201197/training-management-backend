import { PrismaClient } from "@prisma/client";

const isDevelopment = process.env.NODE_ENV === "development";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: isDevelopment
        ? process.env.DATABASE_URL_DEV // Local PostgreSQL
        : process.env.DATABASE_URL, // Supabase PostgreSQL
    },
  },
});

export { prisma };
