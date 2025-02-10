import express from "express";
import validateSignup from "../middlewares/validateSignup.js";
import validateLogin from "../middlewares/validateLogin.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";

import {
	getLoginPage,
	getSignupPage,
	handleLogin,
	handleSignup,
	handleVerification,
	handleLogout,
	forgetPassword,
	resetPassword,
	getForgotPasswordPage,
	getResetPasswordPage,
} from "../controllers/registrationController.js";

const router = express.Router();
router.get("/verify-email", handleVerification);
// router.post("/verify-email", handleVerification);
router.get("/login", getLoginPage);
router.get("/signup", getSignupPage);
router.post("/login", validateLogin, handleLogin);
router.post("/signup", validateSignup, handleSignup);
router.get("/logout", handleLogout);

router.get("/forgot-password", getForgotPasswordPage);
router.get("/reset-password/:token", getResetPasswordPage);

router.post("/forgot-password", forgetPassword);
router.post("/reset-password", resetPassword);

// Protect routes with middleware

export default router; // Default export
