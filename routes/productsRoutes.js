import express from "express";
import { isLoggedIn } from "../middlewares/protectedRoute.js";
import {
	getProductsPage,
	getProductDetails,
} from "../controllers/productsController.js";

const router = express.Router();
router.get("/", isLoggedIn, getProductsPage);
router.get(
	"/:categoryName/:productName/:productId",
	isLoggedIn,
	getProductDetails
);

export default router;
