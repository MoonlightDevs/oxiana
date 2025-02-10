import { body, validationResult } from "express-validator";

const validateSignup = [
	body("name")
		.notEmpty()
		.withMessage('"First name" field is empty!')
		.isLength({ min: 3 })
		.withMessage('"Name" must be at least 3 characters long!'),

	body("email")
		.notEmpty()
		.withMessage('"Email Address" field is empty!')
		.isEmail()
		.withMessage("Invalid Email Address!"),

	body("password")
		.notEmpty()
		.withMessage('"Password" field is empty!')
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long!"),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.render("pages/signup", {
				pageTitle: "Signup",
				errorMessage: errors.array()[0].msg,
			});
		}
		next();
	},
];

export default validateSignup;
