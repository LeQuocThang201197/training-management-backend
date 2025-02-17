import express from "express";
import {
  createConcentration,
  getConcentrations,
  getConcentrationById,
  updateConcentration,
  deleteConcentration,
} from "../controllers/concentration.controller.js";

const router = express.Router();

router.post("/", createConcentration);
router.get("/", getConcentrations);
router.get("/:id", getConcentrationById);
router.put("/:id", updateConcentration);
router.delete("/:id", deleteConcentration);

export default router;
