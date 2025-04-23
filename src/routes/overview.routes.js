import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  getOverviewStats,
  getCompetitionStats,
  getTrainingStats,
} from "../controllers/overview.controller.js";

const router = express.Router();

router.get("/", checkPermission("READ_OVERVIEW"), getOverviewStats);
router.get(
  "/competitions",
  checkPermission("READ_OVERVIEW"),
  getCompetitionStats
);
router.get("/trainings", checkPermission("READ_OVERVIEW"), getTrainingStats);

export default router;
