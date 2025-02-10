import jwt from "jsonwebtoken";

export const protectedRoute = (req, res, next) => {
	try {
		const token = req.cookies.jwtToken;

		// If no token is provided, redirect to login
		if (!token) {
			return res.redirect(303, "/auth/login");
		}

		// Verify the JWT
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// If the user is a guest, show the 403 Unauthorized page
		if (decoded?.role === "guest") {
			return res.status(403).render("./pages/403", {
				pageTitle: "Unauthorized",
				errorMessage: "You do not have permission to access this page.",
			});
		}

		// Attach the user data to the request object for further use
		req.user = decoded;

		next();
	} catch (err) {
		// Handle token expiration
		if (err.name === "TokenExpiredError") {
			return res.redirect(303, "/auth/login?error=sessionExpired");
		}

		// Handle invalid token
		if (err.name === "JsonWebTokenError") {
			return res.redirect(303, "/auth/login?error=invalidToken");
		}

		// Handle other authentication errors
		return res.redirect(303, "/auth/login?error=authenticationError");
	}
};

export const isLoggedIn = (req, res, next) => {
	try {
		const token = req.cookies.jwtToken;

		if (token) {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			if (decoded.role === "guest") {
				req.user = null;
			} else {
				req.user = decoded;
			}
		} else {
			req.user = null;
		}

		next();
	} catch (err) {
		req.user = null;
		next();
	}
};
