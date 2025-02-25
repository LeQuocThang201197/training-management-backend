import { PrismaClient } from "@prisma/client";
import { organizations } from "./seeds/organizations.js";

const prisma = new PrismaClient();

async function main() {
  // Seed organizations
  for (const org of organizations) {
    await prisma.organization.create({
      data: org,
    });
  }

  console.log("Seeded organizations successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
