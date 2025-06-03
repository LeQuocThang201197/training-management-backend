import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  createPaper,
  getPapers,
  getPaperById,
  updatePaperInfo,
  deletePaper,
  getPaperFile,
  getConcentrationsByPaper,
  detachConcentrationFromPaper,
  attachConcentrationToPaper,
  updatePaperFile,
  downloadPaperFile,
} from "../controllers/paper.controller.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post(
  "/",
  checkPermission("CREATE_PAPER"),
  upload.single("file"),
  createPaper
);

router.get("/", checkPermission("READ_PAPER"), getPapers);
router.get("/:id", checkPermission("READ_PAPER"), getPaperById);
router.put("/:id", checkPermission("UPDATE_PAPER"), updatePaperInfo);
router.put(
  "/:id/file",
  checkPermission("UPDATE_PAPER"),
  upload.single("file"),
  updatePaperFile
);
router.delete("/:id", checkPermission("DELETE_PAPER"), deletePaper);
router.get("/:id/file", getPaperFile);
router.get("/:id/concentrations", getConcentrationsByPaper);
router.delete(
  "/:id/concentrations/:concentrationId",
  detachConcentrationFromPaper
);
router.post("/:id/concentrations", attachConcentrationToPaper);
router.get("/:id/download", downloadPaperFile);

export default router;
