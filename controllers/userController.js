export const getUserProfile = (req, res) => {
	try {
		return res.render("pages/profile", {
			pageTitle: "User Profile",
			currentPage: "user-profile",
			navbarCart: res.locals.cart || [],
			user: req.user,
		});
	} catch (error) {
		console.error("Error rendering user profile:", error);
		return res.status(500).render("internal-error", {
			errorMessage: "Internal server error. Please try again later.",
		});
	}
};
