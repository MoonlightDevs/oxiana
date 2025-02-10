import { body, validationResult } from "express-validator";

const validateLogin = [
	body("email")
		.notEmpty()
		.withMessage('"Email" Address field is empty!')
		.isEmail()
		.withMessage("Invalid email address"),

	body("password").notEmpty().withMessage('"Password" field is empty'),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render("pages/login", {
				pageTitle: "Login",
				errorMessage: errors.array()[0].msg,
			});
		}
		next();
	},
];

export default validateLogin;
