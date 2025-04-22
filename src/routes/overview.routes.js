import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  getOverviewStats,
  getTeamStats,
  getParticipantStats,
  getActivityStats,
} from "../controllers/overview.controller.js";

const router = express.Router();

router.get("/", checkPermission("READ_OVERVIEW"), getOverviewStats);
router.get("/teams", checkPermission("READ_OVERVIEW"), getTeamStats);
router.get(
  "/participants",
  checkPermission("READ_OVERVIEW"),
  getParticipantStats
);
router.get("/activities", checkPermission("READ_OVERVIEW"), getActivityStats);

export default router;
