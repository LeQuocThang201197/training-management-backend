import express from "express";
import {
  register,
  login,
  logout,
  verifyAuth,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verifyAuth);

export default router;
