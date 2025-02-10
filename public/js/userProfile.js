const editBtn = document.getElementById("editBtn");
const saveFooter = document.getElementById("saveFooter");
const inputs = document.querySelectorAll(".card-body input");

editBtn.addEventListener("click", function () {
	inputs.forEach(function (input) {
		input.disabled = false;
	});
	saveFooter.style.display = "block";
	editBtn.style.display = "none";
});
