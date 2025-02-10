import axios from "axios";

export const getCartMiddleware = async (req, res, next) => {
	try {
		const apiBaseUrl = process.env.API_BASE_URL;
		const token = req.cookies.jwtToken;
		const headers = token ? { Authorization: `Bearer ${token}` } : {};
		let cart = [];

		try {
			// Fetch cart data from the backend API
			const response = await axios.get(`${apiBaseUrl}/cart`, {
				headers: headers,
				withCredentials: true,
			});

			// Handle token refresh if necessary
			const resToken = response.headers.authorization
				? response.headers.authorization.split(" ")[1]
				: null;

			if (resToken) {
				res.cookie("jwtToken", resToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production", // Secure only in production
					sameSite: "Lax",
					path: "/",
					maxAge: 24 * 60 * 60 * 1000, // 1 day
				});
			}

			// Assign cart items to res.locals
			cart = response.data.cart || [];
		} catch (fetchError) {
			console.error("Error fetching cart data:", fetchError.message);
		}

		// Store cart in res.locals even if the request fails (fallback to empty cart)
		res.locals.cart = cart;
		next();
	} catch (error) {
		console.error("Unexpected error in getCartMiddleware:", error.message);

		if (!res.headersSent) {
			return res.status(500).render("internal-error", {
				errorMessage: "An unexpected error occurred while loading your cart.",
			});
		}

		console.warn("Attempted to send response after headers were already sent.");
	}
};
