import express from "express";
import {
  createTraining,
  updateTraining,
  deleteTraining,
  addParticipantToTraining,
  getTrainingParticipants,
  getTrainingsByConcentration,
  updateTrainingParticipants,
} from "../controllers/training.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/concentration/:concentrationId",
  isAuthenticated,
  getTrainingsByConcentration
);
router.post("/:id/participants", isAuthenticated, addParticipantToTraining);
router.get("/:id/participants", isAuthenticated, getTrainingParticipants);
router.put("/:id", isAuthenticated, updateTraining);
router.delete("/:id", isAuthenticated, deleteTraining);
router.post("/", isAuthenticated, createTraining);
router.put("/:id/participants", isAuthenticated, updateTrainingParticipants);

export default router;
