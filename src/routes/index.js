import express from "express";
import authRoutes from "./auth.routes.js";
import tagRoutes from "./tag.routes.js";
import sportRoutes from "./sport.routes.js";
import teamRoutes from "./team.routes.js";
import paperRoutes from "./paper.routes.js";
import concentrationRoutes from "./concentration.routes.js";
import personRoutes from "./person.routes.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/tags", isAuthenticated, tagRoutes);
router.use("/sports", isAuthenticated, sportRoutes);
router.use("/teams", isAuthenticated, teamRoutes);
router.use("/papers", isAuthenticated, paperRoutes);
router.use("/concentrations", isAuthenticated, concentrationRoutes);
router.use("/persons", personRoutes);

// Protected routes
router.get("/profile", isAuthenticated, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

export default router;
