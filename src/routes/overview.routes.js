import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  getOverviewStats,
  getCompetitionStats,
} from "../controllers/overview.controller.js";

const router = express.Router();

router.get("/", checkPermission("READ_OVERVIEW"), getOverviewStats);
router.get(
  "/competitions",
  checkPermission("READ_OVERVIEW"),
  getCompetitionStats
);

export default router;
