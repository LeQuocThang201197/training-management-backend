import express from "express";
import {
  createPaper,
  getPapers,
  getPaperById,
  updatePaper,
  deletePaper,
  getPaperFile,
  getConcentrationsByPaper,
  detachConcentrationFromPaper,
} from "../controllers/paper.controller.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post("/", upload.single("file"), createPaper);
router.get("/", getPapers);
router.get("/:id", getPaperById);
router.put("/:id", updatePaper);
router.delete("/:id", deletePaper);
router.get("/:id/file", getPaperFile);
router.get("/:id/concentrations", getConcentrationsByPaper);
router.delete(
  "/:id/concentrations/:concentrationId",
  detachConcentrationFromPaper
);

export default router;
