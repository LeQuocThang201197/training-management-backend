import { prisma } from "../src/config/prisma.js";
import { permissions } from "./seeds/permissions.js";
import { roles } from "./seeds/roles.js";

async function main() {
  console.log("Starting seed...");

  // Get existing permissions from database
  console.log("Getting existing permissions...");
  const existingPermissions = await prisma.permission.findMany();
  const existingPermissionNames = existingPermissions.map((p) => p.name);

  console.log("Creating new permissions...");
  const newPermissions = permissions.filter(
    (p) => !existingPermissionNames.includes(p.name)
  );
  for (const permission of newPermissions) {
    await prisma.permission.create({
      data: permission,
    });
  }

  // Create or update roles and their permissions
  console.log("Creating/updating roles and permissions...");
  for (const role of roles) {
    const { permissions: rolePermissions, ...roleData } = role;

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { name: roleData.name },
    });

    let roleId;
    if (existingRole) {
      // Update existing role
      await prisma.role.update({
        where: { id: existingRole.id },
        data: roleData,
      });
      roleId = existingRole.id;

      // Delete existing role permissions
      await prisma.rolePermission.deleteMany({
        where: { role_id: roleId },
      });
    } else {
      // Create new role
      const createdRole = await prisma.role.create({
        data: roleData,
      });
      roleId = createdRole.id;
    }

    // Create new role permissions
    if (rolePermissions && rolePermissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: rolePermissions.map((permissionName) => ({
          role_id: roleId,
          permission_id: existingPermissions.find(p => p.name === permissionName).id,
        })),
      });
    }
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
