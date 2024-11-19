import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword, hashPassword } from "./utils/password";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/lib/db";
import {
	users,
	accounts,
	sessions,
	verificationTokens,
	authenticators,
} from "@/lib/db/schema/user";
// I'm thinking move that logic out of the authorize function and into a separate function that can be tested independently.

let testUser = {
	id: "1",
	name: "Peter Keen",
	email: "pkeen7@gmail.com",
	password: "12345678",
};

const authConfig: NextAuthConfig = {
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
		authenticatorsTable: authenticators,
	}),
	providers: [
		CredentialsProvider({
			name: "Credentials",

			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials, req) => {
				console.log("Authorize called with:", credentials?.email);
				const { email, password } = credentials || {};

				// first hash the test password
				testUser.password = await hashPassword(testUser.password);

				try {
					// verify user exist with given email
					const user = email === testUser.email ? testUser : null;
					if (!user) {
						throw new Error("No user found");
					}
					const isValid = await verifyPassword(
						password as string,
						user.password
					);
					if (!isValid) {
						throw new Error("Invalid password");
					}
					console.log("User logged in successfully");
					return user;
				} catch (error) {
					console.error(
						"Error authorizing user, unkown error:",
						error
					);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	// callbacks: {
	// 	async jwt({ token, user }) {
	// 		if (user) token.id = user.id;
	// 		return token;
	// 	},
	// 	async session({ session, token }) {
	// 		session.user.id = token.id;
	// 		return session;
	// 	},
	// },
	secret: process.env.AUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
