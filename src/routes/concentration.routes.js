import express from "express";
import {
  createConcentration,
  getConcentrations,
  getConcentrationById,
  updateConcentration,
  deleteConcentration,
  getPapersByConcentration,
  attachPaperToConcentration,
  detachPaperFromConcentration,
  updateConcentrationNote,
  deleteConcentrationNote,
  getTrainingsByConcentration,
  addParticipantToConcentration,
} from "../controllers/concentration.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", createConcentration);
router.get("/", getConcentrations);
router.get("/:id", getConcentrationById);
router.put("/:id", updateConcentration);
router.delete("/:id", deleteConcentration);
router.get("/:id/papers", getPapersByConcentration);
router.post("/:id/papers", attachPaperToConcentration);
router.delete("/:id/papers/:paperId", detachPaperFromConcentration);
router.put("/:id/note", updateConcentrationNote);
router.delete("/:id/note", deleteConcentrationNote);
router.get("/:id/trainings", getTrainingsByConcentration);
router.post(
  "/:id/participants",
  isAuthenticated,
  addParticipantToConcentration
);

export default router;
