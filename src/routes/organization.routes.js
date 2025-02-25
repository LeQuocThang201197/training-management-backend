import express from "express";
import {
  getOrganizations,
  getOrganizationTypes,
  createOrganization,
  getAllOrganizations,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organization.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getOrganizations);
router.get("/all", getAllOrganizations);
router.get("/types", getOrganizationTypes);
router.post("/", isAuthenticated, createOrganization);
router.put("/:id", isAuthenticated, updateOrganization);
router.delete("/:id", isAuthenticated, deleteOrganization);

export default router;
