import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  createPersonRole,
  getPersonRoles,
  getPersonRoleById,
  updatePersonRole,
  deletePersonRole,
  getPersonRoleTypes,
} from "../controllers/personRole.controller.js";

const router = express.Router();

router.post("/", checkPermission("CREATE_PERSON_ROLE"), createPersonRole);
router.get("/", checkPermission("READ_PERSON_ROLE"), getPersonRoles);
router.get("/types", getPersonRoleTypes);
router.get("/:id", getPersonRoleById);
router.put("/:id", checkPermission("UPDATE_PERSON_ROLE"), updatePersonRole);
router.delete("/:id", checkPermission("DELETE_PERSON_ROLE"), deletePersonRole);

export default router;
