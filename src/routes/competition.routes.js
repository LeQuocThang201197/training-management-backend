import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  createCompetition,
  getCompetitionsByConcentration,
  getCompetitionById,
  getCompetitionParticipants,
  updateCompetition,
  deleteCompetition,
  addParticipantToCompetition,
  updateCompetitionParticipant,
  removeCompetitionParticipant,
  updateCompetitionParticipants,
  getCompetitions,
  getCompetitionStats,
  addConcentrationToCompetition,
  removeConcentrationFromCompetition,
  getAvailableConcentrations,
  getAvailableParticipants,
} from "../controllers/competition.controller.js";

const router = express.Router();

// Đặt route có pattern cụ thể trước
router.get(
  "/concentration/:concentrationId",
  checkPermission("READ_COMPETITION"),
  getCompetitionsByConcentration
);

// Route thống kê
router.get("/stats", checkPermission("READ_COMPETITION"), getCompetitionStats);

// Sau đó đến các route có pattern với :id
router.post(
  "/:id/participants",
  checkPermission("UPDATE_COMPETITION"),
  addParticipantToCompetition
);
router.get(
  "/:id/participants",
  checkPermission("READ_COMPETITION"),
  getCompetitionParticipants
);
router.get(
  "/:id/available-participants",
  checkPermission("READ_COMPETITION"),
  getAvailableParticipants
);

// Routes quản lý concentrations của competition
router.post(
  "/:id/concentrations",
  checkPermission("UPDATE_COMPETITION"),
  addConcentrationToCompetition
);
router.get(
  "/:id/available-concentrations",
  checkPermission("READ_COMPETITION"),
  getAvailableConcentrations
);
router.delete(
  "/:id/concentrations/:concentrationId",
  checkPermission("UPDATE_COMPETITION"),
  removeConcentrationFromCompetition
);

router.get("/:id", checkPermission("READ_COMPETITION"), getCompetitionById);
router.put("/:id", checkPermission("UPDATE_COMPETITION"), updateCompetition);
router.delete("/:id", checkPermission("DELETE_COMPETITION"), deleteCompetition);
router.put(
  "/:id/participants/:participationId",
  checkPermission("UPDATE_COMPETITION"),
  updateCompetitionParticipant
);
router.delete(
  "/:id/participants/:participationId",
  checkPermission("DELETE_COMPETITION"),
  removeCompetitionParticipant
);

// Cập nhật danh sách người tham gia
router.put(
  "/:id/participants",
  checkPermission("UPDATE_COMPETITION"),
  updateCompetitionParticipants
);

// Cuối cùng là các route gốc
router.post("/", checkPermission("CREATE_COMPETITION"), createCompetition);
router.get("/", checkPermission("READ_COMPETITION"), getCompetitions);

export default router;
