function updateCountdown() {
	const targetDate = new Date("February 13, 2025 00:00:00").getTime();
	const now = new Date().getTime();
	const timeRemaining = targetDate - now;

	if (timeRemaining > 0) {
		const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor(
			(timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
		);
		const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

		document.getElementById("days").textContent = days;
		document.getElementById("hours").textContent = hours;
		document.getElementById("minutes").textContent = minutes;
		document.getElementById("seconds").textContent = seconds;
	} else {
		document.querySelector(".countdown").innerHTML = "Sale has ended!";
	}
}

setInterval(updateCountdown, 1000);
updateCountdown();
