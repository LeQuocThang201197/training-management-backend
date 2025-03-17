import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  createPaper,
  getPapers,
  getPaperById,
  updatePaper,
  deletePaper,
  getPaperFile,
  getConcentrationsByPaper,
  detachConcentrationFromPaper,
  attachConcentrationToPaper,
  uploadPaperFile,
} from "../controllers/paper.controller.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post(
  "/",
  checkPermission("CREATE_PAPER"),
  upload.single("file"),
  createPaper
);

router.post(
  "/:id/upload",
  checkPermission("UPDATE_PAPER"),
  upload.single("file"),
  uploadPaperFile
);

router.get("/", checkPermission("READ_PAPER"), getPapers);
router.get("/:id", checkPermission("READ_PAPER"), getPaperById);
router.put("/:id", checkPermission("UPDATE_PAPER"), updatePaper);
router.delete("/:id", checkPermission("DELETE_PAPER"), deletePaper);
router.get("/:id/file", getPaperFile);
router.get("/:id/concentrations", getConcentrationsByPaper);
router.delete(
  "/:id/concentrations/:concentrationId",
  detachConcentrationFromPaper
);
router.post("/:id/concentrations", attachConcentrationToPaper);

export default router;
