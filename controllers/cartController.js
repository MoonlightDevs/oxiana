import axios from "axios";

export const getCartPage = async (req, res) => {
	try {
		const apiBaseUrl = process.env.API_BASE_URL;
		let cart = [];

		const token = req.cookies.jwtToken;
		const headers = token ? { Authorization: `Bearer ${token}` } : {};

		try {
			const response = await axios({
				method: "GET",
				url: `${apiBaseUrl}/cart`,
				headers,
				withCredentials: true,
			});

			const resToken = response.headers?.authorization?.split(" ")[1];
			if (resToken) {
				res.cookie("jwtToken", resToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production", // Secure cookie in production
					sameSite: "lax",
					path: "/",
					maxAge: 24 * 60 * 60 * 1000, // 24 hours
				});
			}

			cart = response.data?.cart || [];
		} catch (fetchError) {
			console.error("Error while fetching cart data:", fetchError);
			return res.status(500).render("pages/internal-error", {
				errorMessage: "Failed to fetch your cart data. Please try again later.",
			});
		}

		return res.render("pages/cart", {
			pageTitle: "Your Cart",
			message: null,
			currentPage: "Cart",
			cart,
			navbarCart: res.locals.cart || [],
			user: req.user,
		});
	} catch (error) {
		console.error("Error rendering customer cart page:", error);
		if (!res.headersSent) {
			return res.status(500).render("pages/internal-error", {
				errorMessage:
					"An unexpected error occurred while loading your cart. Please try again later.",
			});
		}
		console.warn("Response already sent, cannot render error page.");
	}
};
