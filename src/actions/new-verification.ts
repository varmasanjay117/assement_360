"use server";
import db from "@/db/drizzle";
import { getVerificationTokenByToken } from "@/db/queries";
import { getUserByEmail } from "@/db/queries";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
export const newVerification = async (token: String) => {
	const existingToken = await getVerificationTokenByToken(token);

	if (!existingToken) {
		return { error: "Token does not exist" };
	}

	const hasExpired = new Date(existingToken.expires) < new Date();
	if (hasExpired) {
		return { error: "Token Expired " };
	}
	const existingUser = await getUserByEmail(existingToken.identifier);

	if (!existingUser) {
		return { error: "User does not exist" };
	}

	await db
		.update(users)
		.set({ emailVerified: new Date() })
		.where(eq(users.id, existingUser.id))
		.returning({ updatedId: users.id });

	await db.delete(verificationTokens).where(eq(verificationTokens.token, token));
	return { success: "email verified Successfully" };
};
