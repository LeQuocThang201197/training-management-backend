import express from "express";
import {
  createTraining,
  updateTraining,
  deleteTraining,
  addParticipantToTraining,
  getTrainingParticipants,
} from "../controllers/training.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createTraining);
router.put("/:id", isAuthenticated, updateTraining);
router.delete("/:id", isAuthenticated, deleteTraining);
router.post("/:id/participants", isAuthenticated, addParticipantToTraining);
router.get("/:id/participants", isAuthenticated, getTrainingParticipants);

export default router;
