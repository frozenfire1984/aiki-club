$(document).ready(function () {
	$("#nav-toggle").click(function () {
		$(this).toggleClass("navbar__btn_active")
		$("#nav-menu").slideToggle(500)
	})
});
