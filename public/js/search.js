const API_URL = "https://oxiana-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
	const searchInput = document.getElementById("searchInput");
	const autocompleteResults = document.getElementById("autocompleteResults");

	searchInput.addEventListener("input", async () => {
		const query = searchInput.value.trim();
		autocompleteResults.innerHTML = `<div class="d-flex justify-content-center">
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>`;

		if (query.length > 0) {
			try {
				const response = await axios.get(
					`${API_URL}/api/products/search`,
					{
						params: { search: query },
					}
				);
				const results = response.data.data.slice(0, 10); // Top 10 results

				let autocompleteHTML =
					"<h6 class='text-start'>Products you may look for: </h6> <hr/>";

				results.forEach((product) => {
					const stars = Array(5)
						.fill()
						.map((_, i) =>
							product.averageRating >= i + 1
								? '<i class="fas fa-star text-warning"></i>'
								: '<i class="far fa-star text-muted"></i>'
						)
						.join("");
					autocompleteHTML += `
                            <div class="autocomplete-item d-flex justify-content-start gap-3 p-3 border-bottom" style="curser:pointer" onclick="selectProduct('${
															product.category.name
														}','${product.name}', '${product._id}')">
                                <div class="col-5 col-md-3">
                                <img class="img-fluid" src="${
																	product.images[0]?.url ||
																	"./images/product-9.jpg"
																}" alt="${product.name}"></div>
                                <div class="col-6 text-start">
                                    <h5>${product.name}</h5>
                                    <div class="d-flex flex-row">
                                        <div>${stars}</div>
                                    </div>
                                    <p class="text-start m-0">${
																			product.description
																		}</p><br>
                                    <span>Price: $${product.price}</span>
                                </div>
                            </div>
                        `;
				});

				autocompleteResults.innerHTML = autocompleteHTML;
				autocompleteResults.classList.remove("d-none");
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		} else {
			autocompleteResults.classList.add("d-none");
			autocompleteResults.innerHTML = "";
		}
	});

	// Hide autocomplete when clicking outside
	document.addEventListener("click", (event) => {
		if (
			!searchInput.contains(event.target) &&
			!autocompleteResults.contains(event.target)
		) {
			autocompleteResults.classList.add("d-none");
			autocompleteResults.innerHTML = "";
		}
	});
});

function selectProduct(categoryName, productName, productId) {
	// Handle the product selection, e.g., redirect to the product detail page
	window.location.href = `/products/${categoryName}/${productName}/${productId}`;
}
