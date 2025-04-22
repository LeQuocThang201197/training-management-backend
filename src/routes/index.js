import express from "express";
import authRoutes from "./auth.routes.js";
import tagRoutes from "./tag.routes.js";
import sportRoutes from "./sport.routes.js";
import teamRoutes from "./team.routes.js";
import paperRoutes from "./paper.routes.js";
import concentrationRoutes from "./concentration.routes.js";
import personRoutes from "./person.routes.js";
import personRoleRoutes from "./personRole.routes.js";
import organizationRoutes from "./organization.routes.js";
import absenceRoutes from "./absence.routes.js";
import trainingRoutes from "./training.routes.js";
import competitionRoutes from "./competition.routes.js";
import overviewRoutes from "./overview.routes.js";
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
router.use("/person-roles", personRoleRoutes);
router.use("/organizations", organizationRoutes);
router.use("/absences", absenceRoutes);
router.use("/trainings", trainingRoutes);
router.use("/competitions", competitionRoutes);
router.use("/overview", overviewRoutes);

// Protected routes
router.get("/profile", isAuthenticated, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

export default router;
