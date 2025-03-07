import express from "express";
import {
  createCompetition,
  getCompetitionsByConcentration,
  getCompetitionDetail,
  getCompetitionParticipants,
  updateCompetition,
  deleteCompetition,
  addParticipantToCompetition,
} from "../controllers/competition.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Đặt route có pattern cụ thể trước
router.get(
  "/concentration/:concentrationId",
  isAuthenticated,
  getCompetitionsByConcentration
);

// Sau đó đến các route có pattern với :id
router.post("/:id/participants", isAuthenticated, addParticipantToCompetition);
router.get("/:id/participants", isAuthenticated, getCompetitionParticipants);
router.get("/:id", isAuthenticated, getCompetitionDetail);
router.put("/:id", isAuthenticated, updateCompetition);
router.delete("/:id", isAuthenticated, deleteCompetition);

// Cuối cùng là các route gốc
router.post("/", isAuthenticated, createCompetition);

export default router;
