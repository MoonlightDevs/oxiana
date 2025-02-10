import jwt from "jsonwebtoken";

export const routeHandler = (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			if (req.path === "/") {
				return next();
			}
			return res.redirect("/auth/login");
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return res.redirect("/auth/login?error=sessionExpired");
		}
		return res.redirect("/auth/login");
	}
};
