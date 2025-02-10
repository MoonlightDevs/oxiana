function updatePriceRange() {
	var minRange = document.getElementById("minRange");
	var maxRange = document.getElementById("maxRange");
	var minPriceLabel = document.getElementById("minPriceLabel");
	var maxPriceLabel = document.getElementById("maxPriceLabel");

	// Ensure minRange is always less than maxRange
	if (parseInt(minRange.value) > parseInt(maxRange.value)) {
		var temp = minRange.value;
		minRange.value = maxRange.value;
		maxRange.value = temp;
	}

	minPriceLabel.textContent = "$" + minRange.value;
	maxPriceLabel.textContent = "$" + maxRange.value;
}

const searchInput = document.getElementById("searchInput");
const autocompleteResults = document.getElementById("autocompleteResults");
const searchForm = document.getElementById("searchForm");
const overlay = document.getElementById("overlayer");

searchInput.addEventListener("focus", () => {
	overlay.style.display = "block";
	searchForm.style.zIndex = "10500000";
	autocompleteResults.style.zIndex = "10500000";
});

searchInput.addEventListener("blur", () => {
	setTimeout(() => {
		overlay.style.display = "none";
		searchInput.style.transform = "scale(1)";
		searchForm.style.zIndex = "0";
		autocompleteResults.style.zIndex = "0";
	}, 200);
});

overlay.addEventListener("click", () => {
	searchInput.blur();
});
