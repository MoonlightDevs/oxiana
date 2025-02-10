import axios from "axios";

export const getProductsPage = async (req, res) => {
	const token = req.cookies.jwtToken;
	const headers = {};

	if (token) headers.Authorization = `Bearer ${token}`;
	const queryParams = req.query;
	const apiBaseUrl = process.env.API_BASE_URL;

	let queryString = "";
	if (queryParams.priceMax) queryString += `priceMax=${queryParams.priceMax}&`;
	if (queryParams.priceMin) queryString += `priceMin=${queryParams.priceMin}&`;
	if (queryParams.page) queryString += `page=${queryParams.page}&`;
	if (queryParams.limit) queryString += `limit=${queryParams.limit}&`;
	if (queryParams.query) queryString += `search=${queryParams.query}&`;
	if (queryParams.category) queryString += `category=${queryParams.category}`;

	queryString = queryString.endsWith("&")
		? queryString.slice(0, -1)
		: queryString;

	try {
		const response = await axios({
			method: "GET",
			url: `${apiBaseUrl}/products/search?${queryString}`,
			headers: headers,
			withCredentials: true,
		});

		let dummyProducts = [];
		try {
			const dummyJsonResponse = await axios.get(
				"https://dummyjson.com/products?limit=100"
			);
			dummyProducts = dummyJsonResponse.data.products || [];
		} catch (dummyError) {
			console.error("Error fetching dummy products:", dummyError.message);
		}

		const products = response.data.data || [];

		const productsWithImages = products.map((product, index) => {
			let productImage = "https://via.placeholder.com/300";
			if (dummyProducts.length > 0 && dummyProducts[index]?.thumbnail) {
				productImage = dummyProducts[index].thumbnail;
			}
			return {
				...product,
				images: dummyProducts.length > 0 ? [productImage] : [],
			};
		});

		const totalPages = response.data.totalPages;
		const currentPagination = response.data.currentPage;

		const resToken = response.headers.authorization
			? response.headers.authorization.split(" ")[1]
			: null;

		if (resToken) {
			res.cookie("jwtToken", resToken, {
				httpOnly: true,
				secure: false,
				sameSite: "lax",
				path: "/",
				maxAge: 24 * 60 * 60 * 1000,
			});
		}

		return res.render("pages/products", {
			pageTitle: "Products",
			currentPage: "products",
			user: req.user,
			products: productsWithImages,
			currentPagination: currentPagination,
			totalPages: totalPages,
			navbarCart: res.locals.cart || [],
		});
	} catch (error) {
		console.error("Error in getProductsPage:", error);
		return res.status(500).render("internal-error", {
			errorMessage: "Internal server error. Please try again later.",
		});
	}
};

export const getProductDetails = async (req, res) => {
	const token = req.cookies.jwtToken;
	const headers = {};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}
	const apiBaseUrl = process.env.API_BASE_URL;
	try {
		const productId = req.params.productId;
		if (!productId) {
			return res.status(400).render("internal-error", {
				errorMessage: "Product ID is required.",
			});
		}

		const response = await axios({
			method: "GET",
			url: `${apiBaseUrl}/products/${productId}/product`,
			headers: { Authorization: `Bearer ${token}` },
			withCredentials: true,
		});

		// Update the JWT token if a new one is provided in the response headers.
		const resToken = response.headers.authorization
			? response.headers.authorization.split(" ")[1]
			: null;
		if (resToken) {
			res.cookie("jwtToken", resToken, {
				httpOnly: true,
				secure: false,
				sameSite: "lax",
				path: "/",
				maxAge: 24 * 60 * 60 * 1000, // 24 hours
			});
		}

		const productDetails = response.data || {};
		let quantity;

		if (res.locals.cart.items) {
			try {
				res.locals.cart.items.forEach((item) => {
					if (productDetails[0]._id === item.product._id) {
						quantity = item.quantity;
					}
				});
			} catch (error) {
				return res.status(500).render("pages/internal-error", {
					errorMessage: "Error processing product details.",
				});
			}
		}

		return res.render("pages/product-details", {
			pageTitle: productDetails.name || "Product Details",
			currentPage: "productDetails",
			quantity: quantity || 1,
			user: req.user,
			product: productDetails,
			navbarCart: res.locals.cart || [],
		});
	} catch (error) {
		console.error("Error in getProductDetails:", error);
		return res.status(500).render("pages/internal-error", {
			errorMessage: "Internal server error. Please try again later.",
		});
	}
};
