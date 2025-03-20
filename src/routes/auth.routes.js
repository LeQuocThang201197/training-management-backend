import express from "express";
import {
  register,
  login,
  logout,
  verifyAuth,
  getAllPermissions,
  getAllRoles,
  createRole,
  updateRole,
  assignRole,
  getUsers,
  updateRolePermissions,
  deleteRole,
} from "../controllers/auth.controller.js";
import { checkPermission } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verifyAuth);
router.get("/permissions", checkPermission("ADMIN"), getAllPermissions);
router.get("/roles", checkPermission("ADMIN"), getAllRoles);
router.post("/roles", checkPermission("ADMIN"), createRole);
router.put("/roles/:id", checkPermission("ADMIN"), updateRole);
router.put(
  "/roles/:id/permissions",
  checkPermission("ADMIN"),
  updateRolePermissions
);
router.put("/users/:id/roles", checkPermission("ADMIN"), assignRole);
router.get("/users", checkPermission("ADMIN"), getUsers);
router.delete("/roles/:id", checkPermission("ADMIN"), deleteRole);

export default router;
