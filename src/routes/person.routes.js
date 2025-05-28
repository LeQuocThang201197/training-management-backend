import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  createPerson,
  getPersons,
  getPersonById,
  updatePerson,
  deletePerson,
  getPersonParticipations,
  attachPersonToConcentration,
  updatePersonParticipation,
  updateAllNameSearch,
} from "../controllers/person.controller.js";

const router = express.Router();

router.post("/", checkPermission("CREATE_PERSON"), createPerson);
router.get("/", checkPermission("READ_PERSON"), getPersons);
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
router.post("/update-name-search", updateAllNameSearch);

export default router;
