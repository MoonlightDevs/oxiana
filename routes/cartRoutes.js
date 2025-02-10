import express from "express";
import { protectedRoute, isLoggedIn } from "../middlewares/protectedRoute.js";
import { getCartPage } from "../controllers/cartController.js";

const router = express.Router();

router.get("/", isLoggedIn, getCartPage);

export default router;
