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
  addParticipantToConcentration,
  getConcentrationParticipants,
  updateParticipant,
  removeParticipant,
  getAbsencesByConcentration,
  getParticipantStats,
} from "../controllers/concentration.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", createConcentration);
router.get("/", getConcentrations);
router.get("/:id", getConcentrationById);
router.get("/:id/participants", getConcentrationParticipants);
router.put("/:id", updateConcentration);
router.delete("/:id", deleteConcentration);
router.get("/:id/papers", getPapersByConcentration);
router.post("/:id/papers", attachPaperToConcentration);
router.delete("/:id/papers/:paperId", detachPaperFromConcentration);
router.put("/:id/note", updateConcentrationNote);
router.delete("/:id/note", deleteConcentrationNote);
router.post(
  "/:id/participants",
  isAuthenticated,
  addParticipantToConcentration
);
router.put(
  "/:id/participants/:participantId",
  isAuthenticated,
  updateParticipant
);
router.delete(
  "/:id/participants/:participantId",
  isAuthenticated,
  removeParticipant
);
router.get("/:id/absences", getAbsencesByConcentration);
router.get("/:id/participant-stats", getParticipantStats);

export default router;
