import axios from "axios";

export const getForgotPasswordPage = async (req, res) => {
	try {
		return res.render("pages/forgot-password", {
			pageTitle: "Forgot Password",
			errorMessage: "",
		});
	} catch (error) {
		console.error("Error rendering forgot password page:", error);
		if (!res.headersSent) {
			return res.status(500).render("pages/internal-error", {
				errorMessage:
					"An unexpected error occurred while loading the forgot password page. Please try again later.",
			});
		}
		console.warn("Response already sent; cannot render error page.");
	}
};
export const getResetPasswordPage = async (req, res) => {
	try {
		const token = req.params.token;
		if (!token) {
			// Return a 400 status code when token is missing
			return res.status(400).send("No token provided.");
		}
		return res.render("pages/reset-password", {
			pageTitle: "Reset Password",
			token,
			errorMessage: "",
		});
	} catch (error) {
		console.error("Error rendering reset password page:", error);
		if (!res.headersSent) {
			return res.status(500).render("pages/internal-error", {
				errorMessage:
					"An unexpected error occurred while loading the reset password page. Please try again later.",
			});
		}
		console.warn("Response already sent; cannot render error page.");
	}
};

export const forgetPassword = async (req, res) => {
	const { email } = req.body;
	const apiBaseUrl = process.env.API_BASE_URL;

	try {
		const response = await axios.post(
			`${apiBaseUrl}/auth/forgot-password`,
			{ email }
		);

		// Check for a successful response (HTTP 200)
		if (response.status === 200) {
			return res.render("pages/forgot-password", {
				pageTitle: "Forgot Password",
				successMessage: "A password reset link was sent to your email address!",
				errorMessage: "", // Clear any previous error message
			});
		}

		// If the status is not 200, render the page with a generic error message
		return res.render("pages/forgot-password", {
			pageTitle: "Forgot Password",
			errorMessage: "An error occurred while resetting your password!",
		});
	} catch (error) {
		// Extract a meaningful error message if available
		const errorMessage =
			error.response?.data?.message ||
			"Forgot Password failed. Please try again.";

		// Log detailed error information for debugging
		console.error(
			"Forgot Password Error:",
			error.response?.data || error.message
		);

		return res.render("pages/forgot-password", {
			pageTitle: "Forgot Password",
			errorMessage,
		});
	}
};

export const resetPassword = async (req, res) => {
	const { token, password } = req.body;
	const apiBaseUrl = process.env.API_BASE_URL;

	try {
		const response = await axios.post(
			`${apiBaseUrl}/auth/reset-password/${token}`,
			{ password }
		);

		if (response.status === 200) {
			return res.redirect("/auth/login");
		}

		// In case the response is not a success, fall back to an error message.
		return res.render("pages/reset-password", {
			pageTitle: "Reset Password",
			errorMessage: "Something went wrong. Please try again.",
			token,
		});
	} catch (error) {
		// Extract a detailed error message if available, otherwise use a generic message.
		const errorMessage =
			error.response?.data?.message ||
			"Password reset failed. Please try again.";

		console.error(
			"Password Reset Error:",
			error.response?.data || error.message
		);

		// Render the reset-password page with the error message and token for further attempts.
		return res.render("pages/reset-password", {
			pageTitle: "Reset Password",
			errorMessage,
			token,
		});
	}
};

export const handleSignup = async (req, res) => {
	const token = req.cookies.jwtToken;
	const headers = token ? { Authorization: `Bearer ${token}` } : {};
	const apiBaseUrl = process.env.API_BASE_URL;

	const { name, email, password } = req.body;

	try {
		const response = await axios.post(
			`${apiBaseUrl}/auth/register`,
			{ name, email, password },
			{ headers }
		);

		if (response.status === 200) {
			return res.render("pages/verification", {
				pageTitle: "Signup",
				successMessage: email,
				errorMessage: "",
			});
		}

		// In case the response is not 200, fallback to an error message.
		return res.render("pages/signup", {
			pageTitle: "Signup",
			errorMessage: "Something went wrong. Please try again.",
		});
	} catch (error) {
		const errorMessage =
			error.response?.data?.message || "Signup failed. Please try again.";
		console.error("Signup Error:", error.response?.data || error.message);

		return res.render("pages/signup", {
			pageTitle: "Signup",
			errorMessage,
		});
	}
};

export const handleLogin = async (req, res) => {
	const { email, password } = req.body;
	const apiBaseUrl = process.env.API_BASE_URL;

	// Validate that email and password are provided
	if (!email || !password) {
		return res.status(400).render("pages/login", {
			pageTitle: "Login",
			errorMessage: "Email and password are required.",
		});
	}

	try {
		// Send login request to the backend API
		const response = await axios.post(`${apiBaseUrl}/auth/login`, {
			email,
			password,
		});

		if (response.status === 200) {
			const { token, customerId } = response.data;

			// Clear the existing JWT cookie if it exists
			if (req.cookies.jwtToken) {
				res.clearCookie("jwtToken", {
					httpOnly: true,
					secure: false, // Change to true if using HTTPS
					sameSite: "lax",
					path: "/",
				});
			}

			// Set the new token as a cookie
			res.cookie("jwtToken", token, {
				httpOnly: true,
				secure: false, // Change to true if using HTTPS
				sameSite: "lax",
				path: "/",
				maxAge: 24 * 60 * 60 * 1000, // 1 day
			});

			return res.redirect(`/`);
		}

		// If response status is not 200, render the login page with an error message.
		return res.render("pages/login", {
			pageTitle: "Login",
			errorMessage: response.data.message || "Invalid login credentials.",
		});
	} catch (error) {
		console.error("Login Error:", error.response?.data || error.message);

		// If the error is due to invalid credentials, re-render the login page with a message.
		if (
			error.response &&
			(error.response.status === 400 || error.response.status === 401)
		) {
			return res.render("pages/login", {
				pageTitle: "Login",
				errorMessage:
					error.response.data.message || "Invalid login credentials.",
			});
		}

		// For any unexpected errors, render the internal-error page.
		return res.status(500).render("internal-error", {
			errorMessage: "Internal server error. Please try again later.",
		});
	}
};

export const handleLogout = (req, res) => {
	try {
		// Clear the JWT cookie. Including the path ensures the cookie is correctly cleared.
		res.clearCookie("jwtToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			path: "/",
		});
		return res.redirect("/auth/login");
	} catch (error) {
		console.error("Logout Error:", error.message);
		return res.status(500).render("internal-error", {
			errorMessage: "Internal server error. Please try again later.",
		});
	}
};

export const getLoginPage = async (req, res) => {
	try {
		res.render("pages/login", { pageTitle: "Login", errorMessage: null });
	} catch (error) {
		console.error("Error loading login page:", error.message);
		res.render("pages/login", {
			title: "Login",
			errorMessage: "Error loading login page. Please try again.",
		});
	}
};

export const getSignupPage = async (req, res) => {
	try {
		res.render("pages/signup", { pageTitle: "Signup", errorMessage: null });
	} catch (error) {
		console.error("Error loading signup page:", error.message);
		res.render("pages/signup", {
			title: "Signup",
			errorMessage: "Error loading signup page. Please try again.",
		});
	}
};

export const handleVerification = async (req, res) => {
	const { token } = req.query;
	const apiBaseUrl = process.env.API_BASE_URL;

	if (!token) {
		return res.status(400).render("internal-error", {
			errorMessage: "No token provided for verification.",
		});
	}

	try {
		const response = await axios({
			method: "GET",
			url: `${apiBaseUrl}/auth/verify-email?token=${token}`,
			withCredentials: true,
		});

		if (response.status === 200) {
			return res.redirect("/auth/login");
		}

		return res.status(400).render("internal-error", {
			errorMessage: "Verification failed. Please try again.",
		});
	} catch (error) {
		console.error(
			"Verification failed:",
			error.response?.data || error.message
		);
		return res.status(500).render("internal-error", {
			errorMessage: "Internal server error. Please try again later.",
		});
	}
};
