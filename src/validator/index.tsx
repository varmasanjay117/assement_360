import * as Yup from "yup";
const phoneRegExp = /^[1-9]\d{9}$/;
export const RegisterSchema = Yup.object().shape({
	name: Yup.string()
		.trim()
		.test("fullName", " Please enter your first and last name", (value) => value?.includes(" "))
		.required("Please enter your first and last name"),

	phoneNo: Yup.string().matches(phoneRegExp, "Phone number is not valid").required("Phone is required"),
	email: Yup.string()
		.email("Wrong email format")
		.min(3, "Minimum 3 symbols")
		.max(50, "Maximum 50 symbols")
		.required("Email is required"),
	password: Yup.string()
		.required("No password provided.")
		.min(6, "Password is too short - should be 6 chars minimum."),
});

export const loginSchema = Yup.object().shape({
	email: Yup.string()
		.email("Wrong email format")
		.min(3, "Minimum 3 symbols")
		.max(50, "Maximum 50 symbols")
		.required("Email is required"),

	password: Yup.string().when("isNotOtpLogin", (isNotOtpLogin, schema) => {
		if (isNotOtpLogin[0] === true) {
			return schema.min(3, "Minimum 3 symbols").max(50, "Maximum 50 symbols").required("Password is required");
		}
		return schema;
	}),
});
