import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  createTraining,
  updateTraining,
  deleteTraining,
  addParticipantToTraining,
  getTrainingParticipants,
  getTrainingsByConcentration,
  updateTrainingParticipants,
} from "../controllers/training.controller.js";

const router = express.Router();

router.post("/", checkPermission("CREATE_TRAINING"), createTraining);
router.get(
  "/concentration/:concentrationId",
  checkPermission("READ_TRAINING"),
  getTrainingsByConcentration
);
router.put("/:id", checkPermission("UPDATE_TRAINING"), updateTraining);
router.delete("/:id", checkPermission("DELETE_TRAINING"), deleteTraining);

// Participant management
router.post(
  "/:id/participants",
  checkPermission("UPDATE_TRAINING"),
  addParticipantToTraining
);
router.get(
  "/:id/participants",
  checkPermission("READ_TRAINING"),
  getTrainingParticipants
);

router.put(
  "/:id/participants",
  checkPermission("UPDATE_TRAINING"),
  updateTrainingParticipants
);

export default router;
