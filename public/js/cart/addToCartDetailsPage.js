document.addEventListener("DOMContentLoaded", () => {
	document
		.getElementById("add-to-cart-form")
		.addEventListener("submit", (e) => {
			e.preventDefault();
			const formData = new FormData(e.target);
			const getFormValues = (key) => {
				for (let [name, value] of formData.entries()) {
					if (key === name) {
						return { [name]: value };
					}
				}
			};

			const { quantity } = getFormValues("quantity");
			const { productId } = getFormValues("productId");

			if (quantity && productId) {
				axios
					.post(
						`${API_URL}/api/cart/items`,
						{ productId, quantity: Number(quantity) },
						{ withCredentials: true }
					)
					.then((response) => {
						if (response.status === 201) {
							setTimeout(() => {
								window.location.href = "/cart";
							}, 100);
						}
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			}
		});
});
