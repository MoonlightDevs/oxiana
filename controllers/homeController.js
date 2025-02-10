import axios from "axios";

export const getHomePage = async (req, res) => {
	const apiBaseUrl = process.env.API_BASE_URL;
	let productsResponse;

	// First, fetch products from your main API
	try {
		const token = req.cookies.jwtToken;
		const headers = token ? { Authorization: `Bearer ${token}` } : {};

		productsResponse = await axios({
			method: "GET",
			url: `${apiBaseUrl}/products/search?limit=9`,
			headers,
			withCredentials: true,
		});

		// If the API returns a new token, update the cookie
		const resToken = productsResponse.headers?.authorization?.split(" ")[1];
		if (resToken) {
			res.cookie("jwtToken", resToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production", // secure in production
				sameSite: "lax",
				path: "/",
				maxAge: 24 * 60 * 60 * 1000, // 24 hours
			});
		}
	} catch (error) {
		console.error("Error fetching products from main API:", error);
		if (!res.headersSent) {
			return res.status(500).render("pages/internal-error", {
				errorMessage:
					"Failed to fetch products from the server. Please try again later.",
			});
		}
		console.warn("Response already sent; cannot render error page.");
		return;
	}

	// Retrieve products from the response
	const products = productsResponse.data.data || [];
	let productsWithImages = products;

	// Next, try to enrich products with images from the dummy API.
	// If it fails, we simply send the original products.
	try {
		const dummyJsonResponse = await axios.get(
			"https://dummyjson.com/products?limit=18"
		);
		const dummyProducts = dummyJsonResponse.data.products;

		productsWithImages = products.map((product, index) => {
			const dummyProduct = dummyProducts[index] || {};
			const productImage =
				dummyProduct.thumbnail || "https://via.placeholder.com/300";
			return {
				...product,
				images: [productImage],
			};
		});
	} catch (error) {
		console.error("Error fetching dummy products:", error);
		// If fetching the dummy data fails, productsWithImages remains as products.
	}

	// Finally, render the homepage with the available product data.
	return res.render("pages/homepage", {
		pageTitle: "Home",
		currentPage: "homepage",
		products: productsWithImages,
		navbarCart: res.locals.cart || [],
		user: req.user,
	});
};

export const getBlogPage = (req, res) => {
	try {
		return res.render("pages/blog", {
			pageTitle: "Our Blog",
			currentPage: "blog",
			navbarCart: res.locals.cart || [],
			user: req.user,
		});
	} catch (error) {
		console.error("Error rendering blog page:", error);
		if (!res.headersSent) {
			return res.status(500).render("pages/internal-error", {
				errorMessage:
					"An unexpected error occurred while loading the blog. Please try again later.",
			});
		}
		console.warn("Response already sent; cannot render error page.");
	}
};

export const getContactPage = (req, res) => {
	try {
		return res.render("pages/contact", {
			pageTitle: "Contact Us",
			currentPage: "contact",
			navbarCart: res.locals.cart || [],
			user: req.user,
		});
	} catch (error) {
		console.error("Error rendering contact page:", error);
		if (!res.headersSent) {
			return res.status(500).render("pages/internal-error", {
				errorMessage:
					"An unexpected error occurred while loading the contact page. Please try again later.",
			});
		}
		console.warn("Response already sent; cannot render error page.");
	}
};

const getHelpCenterPage = async (req, res) => {
	try {
		const sections = [
			{ title: "Getting Started", apiUrl: "https://loripsum.net/api/6/short" },
			{
				title: "Account Management",
				apiUrl: "https://loripsum.net/api/12/short",
			},
			{
				title: "Orders & Shipping",
				apiUrl: "https://loripsum.net/api/18/long",
			},
			{
				title: "Returns & Refunds",
				apiUrl: "https://loripsum.net/api/16/short",
			},
			{ title: "Troubleshooting", apiUrl: "https://loripsum.net/api/6/short" },
			{ title: "FAQs", apiUrl: "https://loripsum.net/api/10/short" },
		];

		const contentPromises = sections.map((section) =>
			axios.get(section.apiUrl)
		);
		const responses = await Promise.all(contentPromises);

		return res.render("pages/helpCenter", {
			pageTitle: "OXIANA Help Center",
			currentPage: "help-center",
			sections: sections,
			responses: responses,
			navbarCart: res.locals.cart || [],
			user: req.user,
		});
	} catch (error) {
		console.error("Error generating Help Center page:", error);
		res.status(500).send("Internal Server Error");
	}
};

export default { getHomePage, getBlogPage, getContactPage, getHelpCenterPage };
