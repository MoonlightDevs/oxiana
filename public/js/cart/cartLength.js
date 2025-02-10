const API_URL = "https://oxiana-backend.onrender.com";
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

				// Update the UI in cart-item.ejs
				productTotalPrice.textContent = `${response.data.cartItem.total.toFixed(
					2
				)}$`;
				totalCartItems.textContent = `${response.data.cart.totalItems}`;
				totalCartPrice.textContent = `$${response.data.cart.totalPrice.toFixed(
					2
				)}`;

				// Update the UI in cartHeader.ejs
				console.log(response.data.cart);
				updateCartHeader(response.data.cart);
			})
			.catch((error) => {
				console.error("Error updating quantity:", error);
				alert("Failed to update quantity. Please try again.");
			});
	};

	// Function to update the cart header
	const updateCartHeader = (cart) => {
		const cartLengthHeader = document.querySelector(".cartLengthHeader");
		const cartItemsContainer = document.querySelector(
			".dropdown-menu .container"
		);

		// Update cart length badge
		cartLengthHeader.textContent =
			cart.items.length > 0 ? cart.items.length : "";

		// Re-render cart items in the header
		let cartItemsHTML = "";
		cart.items.forEach((item) => {
			cartItemsHTML += `
                <div class="col-9 col-lg-6 mb-3 mb-lg-0 border-end">
                    <div class="d-flex justify-content-start align-items-center">
                        <img class="img-fluid w-50" src="./images/product-9.jpg" alt="" />
                        <div>
                            <h5>${item.product.name}</h5>
                            <div class="d-flex flex-column">
                                <p><strong>Category: </strong>${
																	item.product.category.name
																}</p>
                                <p><strong>Quantity: </strong>${
																	item.quantity
																}</p>
                                <p><strong>Price: </strong>${item.price} AFN</p>
                                <p><strong>Total Price: </strong><span class="productTotalPrice">${item.total.toFixed(
																	2
																)}</span> AFN</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
		});

		cartItemsContainer.innerHTML = `
            <div class="my-4 p-3 d-flex justify-content-start overflow-x-scroll">
                ${cartItemsHTML}
            </div>
            <div class="p-2 d-flex justify-content-between">
                <div class="d-flex flex-column gap-1">
                    <h5>Cart Summary</h5>
                    <span>Total Cart Items: <b>${cart.totalItems}</b></span>
                    <span>Total Cart Price: <b>${cart.totalPrice.toFixed(
											2
										)}</b></span>
                </div>
                <div>
                    <a href="/cart" class="btn btn-sm btn-warning fw-bold">View Cart</a>
                </div>
            </div>
        `;

		// Handle empty cart scenario
		if (cart.totalItems === 0) {
			cartItemsContainer.innerHTML = `
                <div class="container">
                    <div class="d-flex flex-column gap-5 justify-content-center align-items-center text-center py-5">
                        <h3>The Cart is Empty!</h3>
                        <a href="/products" class="btn btn-sm px-3 fw-bold btn-primary">Continue Shopping</a>
                    </div>
                </div>
            `;
		}
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
