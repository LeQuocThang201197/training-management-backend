import express from "express";
import { checkPermission } from "../middlewares/auth.middleware.js";
import {
  createSport,
  getSports,
  getSportById,
  updateSport,
  deleteSport,
} from "../controllers/sport.controller.js";

const router = express.Router();

router.post("/", checkPermission("CREATE_SPORT"), createSport);
router.get("/", checkPermission("READ_SPORT"), getSports);
router.get("/:id", getSportById);
router.put("/:id", checkPermission("UPDATE_SPORT"), updateSport);
router.delete("/:id", checkPermission("DELETE_SPORT"), deleteSport);

export default router;
