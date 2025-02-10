window.addEventListener("beforeunload", function () {
	localStorage.setItem("forceReload", "true");
});
window.addEventListener("load", function () {
	if (localStorage.getItem("forceReload") == "true") {
		localStorage.removeItem("forceReload");
		location.reload();
	}
});
