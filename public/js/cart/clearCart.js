import { API_URL } from "../config.js";

document.addEventListener("DOMContentLoaded", () => {
	const clearCartButton = document.getElementById("clearCartButton");
	const clearCartModal = new mdb.Modal(
		document.getElementById("clearCartModal")
	);
	const confirmClearCartButton = document.getElementById("confirmClearCart");

	clearCartButton.addEventListener("click", (event) => {
		event.preventDefault();
		clearCartModal.show();
	});

	confirmClearCartButton.addEventListener("click", () => {
		axios
			.delete(`${API_URL}/api/cart/items`, { withCredentials: true })
			.then((response) => {
				window.location.reload();
			})
			.catch((error) => {
				console.error("Error clearing the cart:", error);
			});

		clearCartModal.hide();
	});
});
