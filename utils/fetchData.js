import axios from "axios";
const apiClient = axios.create({
	baseURL: "http://localhost:5000", // Backend API URL
	withCredentials: true, // Include cookies in requests
});

/**
 * Fetch data from the backend API with automatic cookie handling.
 *
 * @param {string} url - The API endpoint (relative to the baseURL).
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [data=null] - The request body (for POST, PUT, etc.).
 * @param {Object} [headers={}] - Additional headers to include in the request.
 * @returns {Promise<any>} - The response data from the API.
 */
async function fetchData(url, method = "GET", data = null, headers = {}) {
	try {
		const response = await apiClient({
			url,
			method,
			data,
			headers,
		});

		// Return the response data
		return response.data;
	} catch (error) {
		// Log and rethrow the error for the caller to handle
		console.error("Error in fetchData:", error.response?.data || error.message);
		throw error;
	}
}
export default fetchData;
