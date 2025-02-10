import { apiKey } from "./config.js";
document.addEventListener("DOMContentLoaded", async function () {
	const localStorageKey = "selectedCurrency";

	async function fetchExchangeRates(baseCurrency) {
		const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;
		try {
			const response = await fetch(apiUrl);
			const data = await response.json();
			return data.conversion_rates;
		} catch (error) {
			console.error("Error fetching exchange rates:", error);
			return null;
		}
	}

	async function convertPrices() {
		const savedCurrency = localStorage.getItem(localStorageKey);
		if (!savedCurrency) return;

		const { currencyCode } = JSON.parse(savedCurrency);
		const conversionRates = await fetchExchangeRates(currencyCode);

		if (!conversionRates || !conversionRates[currencyCode]) return;
		const exchangeRate = conversionRates[currencyCode];

		document.querySelectorAll(".productPrice").forEach((priceElement) => {
			const priceText = priceElement.textContent.trim();
			const priceValue = parseFloat(priceText.split(" ")[0]);
			if (!isNaN(priceValue)) {
				const convertedPrice = (priceValue * exchangeRate).toFixed(2);
				priceElement.textContent = `${convertedPrice} ${currencyCode}`;
			}
		});
	}
	document.querySelectorAll(".each-currency").forEach((item) => {
		item.addEventListener("click", async function () {
			const selectedCurrency = this.textContent.trim().split(" ")[1];
			localStorage.setItem(
				localStorageKey,
				JSON.stringify({ currencyCode: selectedCurrency })
			);
			await convertPrices();
		});
	});
	convertPrices();
});
