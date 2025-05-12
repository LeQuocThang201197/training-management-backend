import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  createAbsence,
  updateAbsence,
  deleteAbsence,
  getAbsences,
} from "../controllers/absence.controller.js";

const router = express.Router();

// Routes cho quản lý vắng mặt
router.get("/participations/:participation_id/absences", getAbsences);
router.post(
  "/participations/:participation_id/absences",
  checkPermission("CREATE_ABSENCE"),
  createAbsence
);
router.put(
  "/participations/:participation_id/absences/:id",
  checkPermission("UPDATE_ABSENCE"),
  updateAbsence
);
router.delete(
  "/participations/:participation_id/absences/:id",
  checkPermission("DELETE_ABSENCE"),
  deleteAbsence
);

export default router;
