import { prisma } from "../config/prisma.js";

export const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Please login to continue",
    });
  }
  next();
};

// Helper function to check user permissions
const getUserPermissions = async (userId) => {
  const userRoles = await prisma.UserRole.findMany({
    where: { user_id: userId },
    include: {
      Role: {
        include: {
          RolePermission: {
            include: {
              Permission: true,
            },
          },
        },
      },
    },
  });

  // Get all permissions from all roles
  const permissions = [
    ...new Set(
      userRoles.flatMap((ur) =>
        ur.Role.RolePermission.map((rp) => rp.Permission.name)
      )
    ),
  ];

  // Check if user has ADMIN permission
  return permissions.includes("ADMIN") ? true : permissions;
};

// Combined middleware for auth and permission check
export const checkPermission =
  (requiredPermission) => async (req, res, next) => {
    try {
      // First check authentication
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Please login to continue",
        });
      }

      // Then check permissions
      const permissions = await getUserPermissions(req.user.id);

      // If user is admin or has required permission
      if (permissions === true || permissions.includes(requiredPermission)) {
        return next();
      }

      res.status(403).json({
        success: false,
        message: "You don't have permission to perform this action",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };
