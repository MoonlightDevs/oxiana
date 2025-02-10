import { API_URL } from "../config.js";

document.addEventListener("DOMContentLoaded", () => {
	const deleteItemButtons = document.querySelectorAll(".delete-item-button");
	const cartLengthSpan = document.getElementById("cartLength");
	const cartItemsList = document.getElementById("cartItemsList");
	const cartSection = document.getElementById("cartSection");
	const cartLengthHeader = document.querySelectorAll(".cartLengthHeader");
	const totalCartPrice = document.querySelector(".totalCartPrice");
	const totalCartItems = document.querySelector(".totalCartItems");
	const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

	deleteItemButtons.forEach((button) => {
		button.addEventListener("click", (event) => {
			event.preventDefault(); // Prevent form submission
			const form = button.closest("form");
			const itemId = form.querySelector("input[name='itemId']").value;
			const cartLength = cartLengthSpan.textContent;

			axios
				.delete(`${API_URL}/api/cart/${itemId}/items`, {
					withCredentials: true,
				})
				.then((response) => {
					// Remove the item from the DOM
					const itemRow = button.closest(".card-body");
					itemRow.remove();
					cartLengthSpan.textContent = Number(cartLength) - 1;
					for (const item of cartLengthHeader) {
						let currentCartLengthHeader = item.textContent;
						item.textContent = Number(currentCartLengthHeader) - 1;

						totalCartItems.textContent = `${response.data.cart.totalItems}`;
						totalCartPrice.textContent = `$${response.data.cart.totalPrice.toFixed(
							2
						)}`;
						if (currentCartLengthHeader == 1) {
							item.textContent = "";
							window.location.reload();
						}
					}
				})
				.then(() => {
					let toastContainer = document.querySelector(".toast-container");
					if (!toastContainer) {
						toastContainer = document.createElement("div");
						toastContainer.className =
							"toast-container position-fixed top-0 end-0 p-3";
						toastContainer.style.zIndex = "10000000";
						document.body.appendChild(toastContainer);
					}

					// Create the green toast element
					const successToast = document.createElement("div");
					successToast.className =
						"toast align-items-center text-white bg-success border-0";
					successToast.role = "alert";
					successToast.setAttribute("aria-live", "assertive");
					successToast.setAttribute("aria-atomic", "true");

					// Create the inner structure of the toast
					const toastContent = document.createElement("div");
					toastContent.className = "d-flex";

					const toastBody = document.createElement("div");
					toastBody.className = "toast-body";
					toastBody.textContent = "Item removed successfully!";

					const closeButton = document.createElement("button");
					closeButton.type = "button";
					closeButton.className = "btn-close btn-close-white me-2 m-auto";
					closeButton.setAttribute("data-mdb-dismiss", "toast");
					closeButton.setAttribute("aria-label", "Close");

					// Append the toast parts together
					toastContent.appendChild(toastBody);
					toastContent.appendChild(closeButton);
					successToast.appendChild(toastContent);
					toastContainer.appendChild(successToast);

					const toastInstance = new mdb.Toast(successToast);
					toastInstance.show();

					setTimeout(() => {
						successToast.classList.add("d-none");
						setTimeout(() => {
							successToast.remove();
						}, 500);
					}, 3000);
				})

				.catch((error) => {
					console.error("Error:", error);
				});
		});
	});
});
