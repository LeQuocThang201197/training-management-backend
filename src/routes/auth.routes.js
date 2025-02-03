import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/verify", isAuthenticated, (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json({
    success: true,
    data: {
      user: userWithoutPassword,
    },
  });
});

export default router;
