import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";

import GitHub from "next-auth/providers/GitHub";
import Google from "next-auth/providers/google";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db/drizzle";
import { loginSchema } from "@/validator";
import { getUserByEmail } from "@/db/queries";

import Credentials from "next-auth/providers/credentials";


export const authConfig = {
	pages: {
		signIn: "/login",
		signOut: "/logout",
	},
	adapter: DrizzleAdapter(db),
	session: { strategy: "jwt" },
	providers: [
		GitHub,
		Google({
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
		Credentials({
			credentials: {
				email: {},
				password: {},
			},
			authorize: async (credentials) => {
				try {
				const validatedFields = await loginSchema.validate(credentials, { abortEarly: false });

				const { email, password } = validatedFields;

				const user = await getUserByEmail(email);

				if (!user || !user.password) return null;

				const passwordMatch = await bcrypt.compare(password, user?.password);

				if (passwordMatch) return user;
					return null;
				} catch (error) {
					return null;
				}
				return null;
			},
		}),
	],
} satisfies NextAuthConfig;

export const { handlers, auth, signOut, signIn } = NextAuth(authConfig);
