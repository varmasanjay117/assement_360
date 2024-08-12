import { asc, between, count, eq, getTableColumns, sql } from "drizzle-orm";
import db from "./drizzle";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { InsertUser, SelectUser, postsTable, users, verificationTokens } from "./schema";
import { UserParams, User } from "@/types/auth";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

const takeUniqueOrThrow = <T>(values: T[]): T => {
	if (values.length !== 1) throw new Error("Found non unique or inexistent value");
	return values[0]!;
};

export async function getUserById(id: SelectUser["id"]): Promise<User[] | null> {
	return db.select().from(users).where(eq(users.id, id));
}

export async function getUserByEmail(email: SelectUser["email"]): Promise<User[] | null> {
	try {
		const currentUser: User[] = await db.select().from(users).where(eq(users.email, email));

		return currentUser.length > 0 ? takeUniqueOrThrow(currentUser) : null;
	} catch (error) {
		console.error("Error fetching user by email:", error);
		return null;
	}
}
export async function setUser(user: UserParams) {
	try {
		// Hash the password
		const hashedPassword = await bcrypt.hash(user.password, 10);

		// Insert the new user into the database
		const [newUser] = await db
			.insert(users)
			.values({
				name: user.name,
				email: user.email,
				phoneNo: user.phoneNo,
				password: hashedPassword,
				emailVerified: null,
				image: null,
			})
			.returning();

		return newUser || null;
	} catch (error) {
		console.error("Error inserting user:", error);
		return null;
	}
}

export const getVerificationTokenByEmail = async (email: string) => {
	try {
		const verificationToken = await db
			.select({ id: verificationTokens.token })
			.from(verificationTokens)
			.where(eq(verificationTokens.identifier, email));

		return verificationToken;
	} catch {
		return null;
	}
};

export const getVerificationTokenByToken = async (token: String) => {
	try {
		const verificationToken = await db.select().from(verificationTokens).where(eq(verificationTokens.token, token));
		// console.log("sanverificationToken", takeUniqueOrThrow(verificationToken));
		return takeUniqueOrThrow(verificationToken);
	} catch (error) {
		return null;
	}
};

export const generateVerificationToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	const existingToken = await getVerificationTokenByEmail(email);

	if (existingToken?.length) {
		let aToken = existingToken?.map((item) => {
			return db.delete(verificationTokens).where(eq(verificationTokens.token, item.id));
		});
		const batchResponse = await db.batch(aToken);
	}

	const generatedToken = await db
		.insert(verificationTokens)
		.values({
			identifier: email,
			token,
			expires,
		})
		.returning({
			identifier: verificationTokens.identifier,
			token: verificationTokens.token,
		});

	return generatedToken;
};

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/new-verification?token=${token}`;

	const { data, error } = await resend.emails.send({
		from: "Acme <onboarding@resend.dev>",
		to: ["delivered@resend.dev"],
		subject: "assessme_360_Hello world",
		react: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
	});
	console.log("data", data);
	console.log("error", error);
};
