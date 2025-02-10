import express from "express";
import { protectedRoute, isLoggedIn } from "../middlewares/protectedRoute.js";
import { getUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/", protectedRoute, getUserProfile);

export default router;
