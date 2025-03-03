import express from "express";
import {
  createAbsence,
  updateAbsence,
  deleteAbsence,
  getAbsences,
} from "../controllers/absence.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Routes cho quản lý vắng mặt
router.get("/participations/:participation_id/absences", getAbsences);
router.post(
  "/participations/:participation_id/absences",
  isAuthenticated,
  createAbsence
);
router.put(
  "/participations/:participation_id/absences/:absence_id",
  isAuthenticated,
  updateAbsence
);
router.delete(
  "/participations/:participation_id/absences/:absence_id",
  isAuthenticated,
  deleteAbsence
);

export default router;
