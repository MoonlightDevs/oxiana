function animateCardToCart(productId) {
	const cartIcon = document.querySelector(".cart-icon"); // Replace with the selector for your cart icon
	const productCard = document.querySelector(`#product-card-${productId}`); // Card with a unique ID

	if (!cartIcon || !productCard) return;

	const clonedCard = productCard.cloneNode(true);
	const cardRect = productCard.getBoundingClientRect();
	const cartIconRect = cartIcon.getBoundingClientRect();

	// Style the cloned card for animation
	clonedCard.style.position = "fixed";
	clonedCard.style.zIndex = "1000";
	clonedCard.style.width = `${productCard.offsetWidth}px`;
	clonedCard.style.height = `${productCard.offsetHeight}px`;
	clonedCard.style.top = `${cardRect.top}px`;
	clonedCard.style.left = `${cardRect.left}px`;
	clonedCard.style.transition = "all 0.4s ease-out"; // Initial "move up" transition
	document.body.appendChild(clonedCard);

	// Move the card up slightly
	requestAnimationFrame(() => {
		clonedCard.style.top = `${cardRect.top - 30}px`; // Adjust for "move up"
	});

	// After the "move up" animation, pause briefly, then move towards the cart
	setTimeout(() => {
		clonedCard.style.transition = "all 0.5s ease-out"; // Transition for the final move
		clonedCard.style.top = `${cartIconRect.top}px`;
		clonedCard.style.left = `${cartIconRect.left}px`;
		clonedCard.style.width = "20px"; // Match cart icon size
		clonedCard.style.height = "20px"; // Match cart icon size
	}, 600); // Wait for the "move up" animation to complete (0.5s) and add a slight pause

	// Delay removal of the cloned card
	setTimeout(() => {
		clonedCard.remove();
	}, 1000); // Slightly longer than the total animation duration
}
