import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  createTeam,
  getTeams,
  updateTeam,
  deleteTeam,
  getEnumValues,
} from "../controllers/team.controller.js";

const router = express.Router();

router.get("/enums", getEnumValues);
router.post("/", checkPermission("CREATE_TEAM"), createTeam);
router.get("/", checkPermission("READ_TEAM"), getTeams);
router.put("/:id", checkPermission("UPDATE_TEAM"), updateTeam);
router.delete("/:id", checkPermission("DELETE_TEAM"), deleteTeam);

export default router;
