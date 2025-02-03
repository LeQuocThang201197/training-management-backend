import express from "express";
import {
  createSport,
  getSports,
  getSportById,
  updateSport,
  deleteSport,
} from "../controllers/sport.controller.js";

const router = express.Router();

router.post("/", createSport);
router.get("/", getSports);
router.get("/:id", getSportById);
router.put("/:id", updateSport);
router.delete("/:id", deleteSport);

export default router;
