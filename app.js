import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import expressSession from "express-session";
import { isLoggedIn } from "./middlewares/protectedRoute.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRoutes from "./routes/userRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import registerationRoutes from "./routes/registerationRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { getCartMiddleware } from "./middlewares/getCartMiddleware.js";
// Routes
// app.use(isLoggedIn);

app.use(getCartMiddleware);
app.use("/", homeRoutes);
app.use("/cart", cartRoutes);
app.use("/auth", registerationRoutes);
app.use("/products", productsRoutes);
app.use("/user", userRoutes);
app.all("*", (req, res) => {
	return res.render("./pages/404");
});
// Start server
app.listen(3000, "0.0.0.0", () => {
	console.log("Frontend app running at http://localhost:3000");
});
