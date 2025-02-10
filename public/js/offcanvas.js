// JavaScript to control the custom offcanvas and overlay
const customOpenButton = document.getElementById("customOpenOffcanvas");
const customCloseButton = document.getElementById("customCloseOffcanvas");
const customOffcanvas = document.getElementById("customOffcanvas");
const customOverlay = document.getElementById("customOverlay");

// Open Offcanvas
customOpenButton.addEventListener("click", () => {
	customOffcanvas.classList.add("custom-open");
	customOverlay.classList.add("custom-show");
});

// Close Offcanvas
customCloseButton.addEventListener("click", () => {
	customOffcanvas.classList.remove("custom-open");
	customOverlay.classList.remove("custom-show");
});

// Close Offcanvas by clicking on overlay
customOverlay.addEventListener("click", () => {
	customOffcanvas.classList.remove("custom-open");
	customOverlay.classList.remove("custom-show");
});
