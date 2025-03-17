import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  getOrganizations,
  getOrganizationTypes,
  createOrganization,
  getAllOrganizations,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organization.controller.js";

const router = express.Router();

router.get("/", checkPermission("READ_ORGANIZATION"), getOrganizations);
router.get("/all", getAllOrganizations);
router.get("/types", getOrganizationTypes);
router.post("/", checkPermission("CREATE_ORGANIZATION"), createOrganization);
router.put("/:id", checkPermission("UPDATE_ORGANIZATION"), updateOrganization);
router.delete(
  "/:id",
  checkPermission("DELETE_ORGANIZATION"),
  deleteOrganization
);

export default router;
