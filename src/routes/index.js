import express from "express";
import authRoutes from "./auth.routes.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Mount auth routes
router.use("/auth", authRoutes);

// Protected routes
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

export default router;
