import express from "express";
import homeController from "../controllers/homeController.js";
import { protectedRoute, isLoggedIn } from "../middlewares/protectedRoute.js";

const router = express.Router();

router.get("/", isLoggedIn, homeController.getHomePage);
router.get("/blog", isLoggedIn, homeController.getBlogPage);
router.get("/contact", isLoggedIn, homeController.getContactPage);
router.get("/help-center", isLoggedIn, homeController.getHelpCenterPage);

export default router;
