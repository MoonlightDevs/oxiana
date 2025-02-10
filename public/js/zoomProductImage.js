function changeImage(event, src) {
	document.getElementById("mainImage").src = src;
	document
		.querySelectorAll(".thumbnail")
		.forEach((thumb) => thumb.classList.remove("active"));
	event.target.classList.add("active");
}
document.addEventListener("DOMContentLoaded", () => {
	const zoomableImage = document.getElementById("mainImage");
	const imageOverlay = document.getElementById("imageOverlay");
	const imageButtons = document.querySelector(".image-buttons");
	const zoomInBtn = document.querySelector(".zoom-in-btn");
	const zoomOutBtn = document.querySelector(".zoom-out-btn");
	const closeBtn = document.querySelector(".btn-close-zoomable-image");

	let scale = 2;
	const scaleStep = 0.2;
	const maxScale = 8;
	const minScale = 2;

	zoomableImage.addEventListener("click", () => {
		imageButtons.classList.add("d-flex");
		zoomableImage.classList.add("zoomed");
		imageOverlay.style.display = "block";
		zoomableImage.style.transform = "translate(-50%, -50%) scale(2)";
	});

	imageOverlay.addEventListener("click", () => {
		imageButtons.classList.remove("d-flex");
		zoomableImage.classList.remove("zoomed");
		zoomableImage.style.transform = "scale(1)";
		scale = 2;
		imageOverlay.style.display = "none";

		if (document.fullscreenElement) {
			document.exitFullscreen();
			icon.classList.remove("fa-compress");
			icon.classList.add("fa-expand");
		}
	});
	closeBtn.addEventListener("click", () => {
		imageButtons.classList.remove("d-flex");
		zoomableImage.classList.remove("zoomed");
		zoomableImage.style.transform = "scale(1)";
		scale = 2;
		imageOverlay.style.display = "none";
		
		if (document.fullscreenElement) {
			document.exitFullscreen();
			icon.classList.remove("fa-compress");
			icon.classList.add("fa-expand");
		}
	});

	zoomInBtn.addEventListener("click", () => {
		if (scale < maxScale) {
			scale += scaleStep;
			zoomableImage.style.transform = `translate(-50%, -50%) scale(${scale})`;
		}
	});

	zoomOutBtn.addEventListener("click", () => {
		if (scale > minScale) {
			scale -= scaleStep;
			zoomableImage.style.transform = `translate(-50%, -50%) scale(${scale})`;
		}
	});

	document
		.querySelector(".image-fullscreen-btn")
		.addEventListener("click", function () {
			let icon = document.getElementById("fs-icon");
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen();
				icon.classList.remove("fa-expand");
				icon.classList.add("fa-compress");
			} else {
				document.exitFullscreen();
				icon.classList.remove("fa-compress");
				icon.classList.add("fa-expand");
			}
		});
});
