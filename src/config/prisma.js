import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.NODE_ENV === "production"
          ? process.env.DIRECT_URL // Use DIRECT_URL in production
          : process.env.DATABASE_URL, // Use pooled connection locally
    },
  },
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

export { prisma, connectDB };
