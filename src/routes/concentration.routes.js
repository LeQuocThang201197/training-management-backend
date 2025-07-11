import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
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
  getParticipantById,
  updateParticipant,
  removeParticipant,
  getAbsencesByConcentration,
  getParticipantStats,
  getRooms,
  getAvailablePapers,
  copyParticipantsToConcentration,
} from "../controllers/concentration.controller.js";

const router = express.Router();

router.get("/rooms", getRooms);
router.get("/", checkPermission("READ_CONCENTRATION"), getConcentrations);
router.post("/", checkPermission("CREATE_CONCENTRATION"), createConcentration);
router.get("/:id", checkPermission("READ_CONCENTRATION"), getConcentrationById);
router.get(
  "/:id/participants",
  checkPermission("READ_CONCENTRATION"),
  getConcentrationParticipants
);
router.get(
  "/:id/participants/:participantId",
  checkPermission("READ_CONCENTRATION"),
  getParticipantById
);
router.put(
  "/:id",
  checkPermission("UPDATE_CONCENTRATION"),
  updateConcentration
);
router.delete(
  "/:id",
  checkPermission("DELETE_CONCENTRATION"),
  deleteConcentration
);
router.get(
  "/:id/papers",
  checkPermission("READ_PAPER"),
  getPapersByConcentration
);
router.post(
  "/:id/papers",
  checkPermission("UPDATE_PAPER"),
  attachPaperToConcentration
);
router.delete(
  "/:id/papers/:paperId",
  checkPermission("UPDATE_PAPER"),
  detachPaperFromConcentration
);
router.put("/:id/note", updateConcentrationNote);
router.delete("/:id/note", deleteConcentrationNote);
router.post(
  "/:id/participants",
  checkPermission("UPDATE_CONCENTRATION"),
  addParticipantToConcentration
);
router.post(
  "/:id/participants/copy",
  checkPermission("UPDATE_CONCENTRATION"),
  copyParticipantsToConcentration
);
router.put(
  "/:id/participants/:participantId",
  checkPermission("UPDATE_CONCENTRATION"),
  updateParticipant
);
router.delete(
  "/:id/participants/:participantId",
  checkPermission("UPDATE_CONCENTRATION"),
  removeParticipant
);
router.get("/:id/absences", getAbsencesByConcentration);
router.get("/:id/participant-stats", getParticipantStats);
router.get(
  "/:id/available-papers",
  checkPermission("READ_PAPER"),
  getAvailablePapers
);

export default router;
