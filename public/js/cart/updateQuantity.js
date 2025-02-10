
document.addEventListener("DOMContentLoaded", () => {
	// Function to update the quantity of an item in the cart
	const updateQuantity = (itemId, newQuantity, itemRow) => {
		axios
			.put(
				`${API_URL}/api/cart/${itemId}/items`,
				{ quantity: newQuantity },
				{ withCredentials: true }
			)
			.then((response) => {
				const productTotalPrice = itemRow.querySelector(".productTotalPrice");
				const totalCartPrice = document.querySelector(".totalCartPrice");
				const totalCartItems = document.querySelector(".totalCartItems");

				// Update the UI with the response from the server
				productTotalPrice.textContent = `${response.data.cartItem.total.toFixed(
					2
				)}$`;

				totalCartItems.textContent = `${response.data.cart.totalItems}`;
				totalCartPrice.textContent = `$${response.data.cart.totalPrice.toFixed(
					2
				)}`;
			})
			.catch((error) => {
				console.error("Error updating quantity:", error);
				alert("Failed to update quantity. Please try again.");
			});
	};

	// Attach event listeners to increment and decrement buttons
	document.querySelectorAll(".increment, .decrement").forEach((button) => {
		button.addEventListener("click", (event) => {
			event.preventDefault();

			const itemRow = button.closest(".row.position-relative");
			const quantitySpan = itemRow.querySelector(".quantity");
			const itemId = itemRow.querySelector("input[name='itemId']").value;

			let currentQuantity = parseInt(quantitySpan.textContent);
			const change = button.classList.contains("increment") ? 1 : -1;
			const newQuantity = currentQuantity + change;

			// Prevent quantity from going below 1
			if (newQuantity < 1) return;

			// Temporarily update the quantity in the UI for smoother interaction
			quantitySpan.textContent = newQuantity;

			// Call the updateQuantity function to sync with the backend
			updateQuantity(itemId, newQuantity, itemRow);
		});
	});
});
