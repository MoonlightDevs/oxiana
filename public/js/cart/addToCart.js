import { API_URL } from "../config.js";
document.addEventListener("DOMContentLoaded", () => {
	const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
	const cartLengthHeader = document.querySelectorAll(".cartLengthHeader");

	addToCartButtons.forEach((button) => {
		button.addEventListener("click", async () => {
			const productId = button.getAttribute("data-product-id");
			button.disabled = true;

			axios
				.post(
					`${API_URL}/api/cart/items`,
					{ productId, quantity: 1 },
					{ withCredentials: true }
				)
				.then((response) => {
					if (response.status === 201) {
						// Update cart length
						cartLengthHeader.forEach((item) => {
							let currentCartLengthHeader = item.textContent;
							item.textContent = Number(currentCartLengthHeader) + 1;
						});

						// Enable the button again
						button.disabled = false;
					}
				})
				.then(() => {
					// Wait for DOM update (if needed) and then navigate
					setTimeout(() => {
						window.location.href = "/cart";
					}, 100); // You can adjust the delay time as needed
				})
				.catch((error) => {
					console.error("Error:", error);
					button.disabled = false;
				});
		});
	});
});
