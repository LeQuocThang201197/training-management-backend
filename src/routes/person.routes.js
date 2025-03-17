import express from "express";
import {
  createPerson,
  getPersons,
  getPersonById,
  updatePerson,
  deletePerson,
  getPersonParticipations,
  attachPersonToConcentration,
  updatePersonParticipation,
  getPersonsByName,
} from "../controllers/person.controller.js";
import { checkPermission } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", checkPermission("CREATE_PERSON"), createPerson);
router.get("/", checkPermission("READ_PERSON"), getPersons);
router.get("/search", checkPermission("READ_PERSON"), getPersonsByName);
router.get("/:id", checkPermission("READ_PERSON"), getPersonById);
router.put("/:id", checkPermission("UPDATE_PERSON"), updatePerson);
router.delete("/:id", checkPermission("DELETE_PERSON"), deletePerson);
router.get("/:id/participations", getPersonParticipations);
router.post(
  "/:id/participations",
  checkPermission("ATTACH_PERSON_TO_CONCENTRATION"),
  attachPersonToConcentration
);
router.put(
  "/:id/participations/:participationId",
  checkPermission("UPDATE_PERSON_PARTICIPATION"),
  updatePersonParticipation
);

export default router;
