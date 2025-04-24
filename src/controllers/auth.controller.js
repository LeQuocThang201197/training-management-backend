import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import passport from "passport";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message,
      });
    }

    req.logIn(user, async (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Server error",
          error: err.message,
        });
      }

      // Get user's roles and permissions
      const userRoles = await prisma.userRole.findMany({
        where: { user_id: user.id },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            ...userWithoutPassword,
            roles: userRoles.map((ur) => ur.role.name),
            permissions: [
              ...new Set(
                userRoles.flatMap((ur) =>
                  ur.role.permissions.map((rp) => rp.permission.name)
                )
              ),
            ],
          },
        },
      });
    });
  })(req, res, next);
};

// New role management functions
export const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.json({ success: true, data: permissions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    const role = await prisma.role.create({
      data: {
        name,
        description,
      },
    });

    res.json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Just update role basic info without touching permissions
    const role = await prisma.role.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    // Validate input
    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid permissions data. Expected an array of permission IDs",
      });
    }

    // Delete existing permissions
    await prisma.rolePermission.deleteMany({
      where: { role_id: parseInt(id) },
    });

    // Add new permissions
    const role = await prisma.role.update({
      where: { id: parseInt(id) },
      data: {
        permissions: {
          createMany: {
            data: permissions.map((permissionId) => ({
              permission_id: permissionId,
            })),
          },
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Role permissions updated successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Keep existing logout and verifyAuth functions
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
    res.json({
      success: true,
      message: "Logout successful",
    });
  });
};

export const verifyAuth = async (req, res) => {
  if (req.isAuthenticated()) {
    // Get user's roles and permissions
    const userRoles = await prisma.userRole.findMany({
      where: { user_id: req.user.id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = req.user;

    res.json({
      success: true,
      data: {
        user: {
          ...userWithoutPassword,
          roles: userRoles.map((ur) => ur.role.name),
          permissions: [
            ...new Set(
              userRoles.flatMap((ur) =>
                ur.role.permissions.map((rp) => rp.permission.name)
              )
            ),
          ],
        },
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
};

export const assignRole = async (req, res) => {
  try {
    const userId = parseInt(req.params.id); // Get userId from params instead of body
    const { roles } = req.body; // Expect 'roles' array in body

    // Validate input
    if (!roles || !Array.isArray(roles)) {
      return res.status(400).json({
        success: false,
        message: "Invalid roles data. Expected an array of role IDs",
      });
    }

    // Delete existing user roles first
    await prisma.userRole.deleteMany({
      where: { user_id: userId },
    });

    // Create new user roles
    await prisma.userRole.createMany({
      data: roles.map((roleId) => ({
        user_id: userId,
        role_id: roleId,
      })),
    });

    // Get updated user with roles for response
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      message: "User roles updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // First delete all role permissions
    await prisma.rolePermission.deleteMany({
      where: { role_id: parseInt(id) },
    });

    // Then delete all user roles
    await prisma.userRole.deleteMany({
      where: { role_id: parseInt(id) },
    });

    // Finally delete the role
    const role = await prisma.role.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Role deleted successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
