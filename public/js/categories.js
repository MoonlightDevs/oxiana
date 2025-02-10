
// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
	loadCategories();
});

/**
 * Fetches categories from the backend.
 */
function loadCategories() {
	fetch(`${API_URL}/api/categories`,  {
		method: "GET",
		credentials: "include", // Ensures cookies and auth headers are sent
		headers: {
		  "Content-Type": "application/json",
		},
	  })
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			return data.categories;
		})
		.then((categories) => {
			if (Array.isArray(categories)) {
				displayCategoriesInContainer(categories);
			} else {
				console.error("Unexpected data format:", categories);
			}
		})
		.catch((error) => {
			console.error("Error fetching categories:", error);
		});
}

/**
 * Displays the retrieved categories in the container.
 * The categories will be evenly distributed into 4 columns.
 * @param {Array} categories - Array of category objects.
 */
function displayCategoriesInContainer(categories) {
	// Select the row container where columns will be added
	const row = document.querySelector(".container .row.my-4.categories");
	if (!row) {
		console.error("Row container not found.");
		return;
	}

	// Define the number of columns to distribute categories into.
	const numColumns = 1;
	// Prepare an array of columns, each is an array to hold categories.
	const columns = Array.from({ length: numColumns }, () => []);

	// Distribute categories into columns in a round-robin fashion.
	categories.forEach((category, index) => {
		columns[index % numColumns].push(category);
	});

	// Clear any existing content inside the row.
	row.innerHTML = "";

	// For each column, create a column div and add the category links as a list group.
	columns.forEach((colCategories) => {
		// Create the column div with the same classes as in your HTML.
		const colDiv = document.createElement("div");
		colDiv.className = "col-12 mb-3 mb-lg-0";

		// Create the list group container.
		const listGroup = document.createElement("div");
		listGroup.className = "list-group list-group-flush";

		// Create an anchor element for each category.
		colCategories.forEach((cat) => {
			const a = document.createElement("a");
			// Adjust the href URL as needed (using slug, id, or any other property)
			a.href = `/products?category=${cat._id}`;
			a.className = "list-group-item list-group-item-action";
			a.textContent = cat.name;
			listGroup.appendChild(a);
		});

		// Append the list group to the column div.
		colDiv.appendChild(listGroup);
		// Append the column div to the row container.
		row.appendChild(colDiv);
	});
}
