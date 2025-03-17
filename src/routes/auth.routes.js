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
router.post("/roles/assign", checkPermission("ADMIN"), assignRole);

export default router;
