import express from "express";
import {
  createPersonRole,
  getPersonRoles,
  getPersonRoleById,
  updatePersonRole,
  deletePersonRole,
} from "../controllers/personRole.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createPersonRole);
router.get("/", getPersonRoles);
router.get("/:id", getPersonRoleById);
router.put("/:id", isAuthenticated, updatePersonRole);
router.delete("/:id", isAuthenticated, deletePersonRole);

export default router;
