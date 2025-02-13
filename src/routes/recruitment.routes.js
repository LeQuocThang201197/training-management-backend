import express from "express";
import {
  createRecruitment,
  getRecruitments,
  getRecruitmentById,
  updateRecruitment,
  deleteRecruitment,
} from "../controllers/recruitment.controller.js";

const router = express.Router();

router.post("/", createRecruitment);
router.get("/", getRecruitments);
router.get("/:id", getRecruitmentById);
router.put("/:id", updateRecruitment);
router.delete("/:id", deleteRecruitment);

export default router;
