import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  createAchievement,
  getAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
  getAchievementsByPerson,
  getAchievementsByCompetition,
  getAchievementStats,
} from "../controllers/achievement.controller.js";

const router = express.Router();

// Route thống kê
router.get("/stats", checkPermission("READ_ACHIEVEMENT"), getAchievementStats);

// Routes lấy thành tích theo person và competition
router.get(
  "/person/:personId",
  checkPermission("READ_ACHIEVEMENT"),
  getAchievementsByPerson
);
router.get(
  "/competition/:competitionId",
  checkPermission("READ_ACHIEVEMENT"),
  getAchievementsByCompetition
);

// CRUD routes
router.post("/", checkPermission("CREATE_ACHIEVEMENT"), createAchievement);
router.get("/", checkPermission("READ_ACHIEVEMENT"), getAchievements);
router.get("/:id", checkPermission("READ_ACHIEVEMENT"), getAchievementById);
router.put("/:id", checkPermission("UPDATE_ACHIEVEMENT"), updateAchievement);
router.delete("/:id", checkPermission("DELETE_ACHIEVEMENT"), deleteAchievement);

export default router;
