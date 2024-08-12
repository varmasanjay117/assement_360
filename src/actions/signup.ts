"use server";
import { RegisterSchema } from "@/validator";
import { getUserByEmail, setUser } from "@/db/queries";
import { generateVerificationToken } from "@/db/queries";
import { sendVerificationEmail } from "@/db/queries";
export const signUpRegister = async (values) => {
	try {
		// Validate the input values
		const validatedFields = await RegisterSchema.validate(values, { abortEarly: false });

		const { email } = validatedFields;

		// // Check if the user already exists
		const existingUser = await getUserByEmail(email);

		if (existingUser && existingUser.length > 0) {
			return { error: "Email already in use!" };
		}

		let createdUser = await setUser(validatedFields);

		// // Generate a verification token
		const [verificationToken] = await generateVerificationToken(email);
		console.log("verificationToken", verificationToken);
		// // Send the verification email
		await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

		return { success: "Confirmation email sent!" };
	} catch (error) {
		console.error("Registration error:", error);
		if (error?.name === "ValidationError") {
			return { error: "Invalid fields!", details: error?.errors };
		}
		return { error: "An unexpected error occurred. Please try again." };
	}

	// try {
	// 	const validatedFields = await RegisterSchema.validate(values);
	// } catch (error) {
	// 	return { error: "Invalid fields!" };
	// }
	// const validatedFields = await RegisterSchema.validate(values);

	// console.log("valuessanjay", validatedFields);

	// const { email, password, name, phoneNo } = validatedFields.data;
	// const hashedPassword = await bcrypt.hash(password, 10);
	// const existingUser = await getUserByEmail(email);

	// console.log("existingUser", existingUser, email);

	// if (existingUser) {
	// 	return { error: "Email already in use!" };
	// }

	// await db.insert(user).values({
	// 	id: hashedPassword,
	// 	name,
	// 	email,
	// 	phoneNo,
	// 	password: hashedPassword,
	// });

	// const [verificationToken] = await generateVerificationToken(email);

	// console.log("verificationToken", verificationToken);

	// await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

	return { success: "Confirmation email sent!" };
};
