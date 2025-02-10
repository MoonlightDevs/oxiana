document.addEventListener("DOMContentLoaded", function () {
	// ----- Existing Currency Selection Code -----
	const dropdownItems = document.querySelectorAll(".each-currency");
	const currencyToggle = document.querySelector(".currencyDropdown");
	const checkIconClass = "fas fa-check text-success ms-2";
	const localStorageKey = "selectedCurrency";

	function updateSelectedCurrency(currencyCode, flagClass) {
		currencyToggle.innerHTML = `<i class="${flagClass} flag m-0"></i> ${currencyCode} <i class="fas fa-chevron-down ms-2"></i>`;
	}

	function loadSelectedCurrency() {
		const savedCurrency = localStorage.getItem(localStorageKey);
		if (savedCurrency) {
			const { currencyCode, flagClass } = JSON.parse(savedCurrency);
			updateSelectedCurrency(currencyCode, flagClass);

			dropdownItems.forEach((item) => {
				if (item.textContent.trim() === currencyCode) {
					item.innerHTML += ` <i class="${checkIconClass}"></i>`;
				}
			});
		}
	}
	// ----- End Currency Selection Code -----

	// ----- Price Conversion Code -----
	function convertPrices() {
		// Read the selected currency; default to AFN if nothing is stored.
		const savedCurrency = localStorage.getItem(localStorageKey);
		let selectedCurrency = "AFN";
		if (savedCurrency) {
			const { currencyCode } = JSON.parse(savedCurrency);
			selectedCurrency = currencyCode;
		}

		// Select all product price elements.
		const priceElements = document.querySelectorAll(".productPriceEveryWhere");

		// If the selected currency is the base currency, update prices with base values.
		if (selectedCurrency === "AFN") {
			priceElements.forEach((elem) => {
				const basePrice = parseFloat(elem.getAttribute("data-base-price"));
				elem.textContent = `${basePrice.toFixed(2)} AFN`;
			});
			return;
		}

		// For currencies other than AFN, fetch conversion rates.
		const baseCurrency = "AFN";
		const apiKey = "12aa671152410fc086416548"; // Replace with your actual ExchangeRate-API key.
		const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				if (data.result === "success") {
					const conversionRate = data.conversion_rates[selectedCurrency];
					if (conversionRate) {
						priceElements.forEach((elem) => {
							let basePrice = parseFloat(elem.getAttribute("data-base-price"));
							if (isNaN(basePrice)) {
								basePrice = parseFloat(elem.textContent);
							}
							const convertedPrice = (basePrice * conversionRate).toFixed(2);
							elem.textContent = `${convertedPrice} ${selectedCurrency}`;
						});
					} else {
						console.error(`Conversion rate for ${selectedCurrency} not found.`);
					}
				} else {
					console.error("ExchangeRate-API error:", data);
				}
			})
			.catch((error) => console.error("Error fetching exchange rates:", error));
	}
	// ----- End Price Conversion Code -----

	// ----- Update Currency & Prices on User Selection -----
	dropdownItems.forEach((item) => {
		item.addEventListener("click", function (e) {
			e.preventDefault();

			// Remove existing check icons from all items.
			dropdownItems.forEach((i) => i.querySelector(".fa-check")?.remove());

			const flagElement = item.querySelector(".flag");
			const currencyCode = item.textContent.trim();
			const flagClass = flagElement.classList[0];

			updateSelectedCurrency(currencyCode, flagClass);
			item.innerHTML += ` <i class="${checkIconClass}"></i>`;

			// Save the selected currency to localStorage.
			localStorage.setItem(
				localStorageKey,
				JSON.stringify({ currencyCode, flagClass })
			);

			// Convert product prices using the newly selected currency.
			convertPrices();
		});
	});

	// Load any previously selected currency and convert prices on initial load.
	loadSelectedCurrency();
	convertPrices();
});
