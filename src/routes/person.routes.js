import express from "express";
import {
  createPerson,
  getPersons,
  getPersonById,
  updatePerson,
  deletePerson,
  getPersonParticipations,
} from "../controllers/person.controller.js";

const router = express.Router();

router.post("/", createPerson);
router.get("/", getPersons);
router.get("/:id", getPersonById);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);
router.get("/:id/participations", getPersonParticipations);

export default router;
