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
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", createPerson);
router.get("/", getPersons);
router.get("/search", getPersonsByName);
router.get("/:id", getPersonById);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);
router.get("/:id/participations", getPersonParticipations);
router.post(
  "/:id/participations",
  isAuthenticated,
  attachPersonToConcentration
);
router.put(
  "/:id/participations/:participationId",
  isAuthenticated,
  updatePersonParticipation
);

export default router;
