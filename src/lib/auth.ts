import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import test from "node:test";
// import bcrypt from "bcrypt";
// import { db } from "@/lib/db";
// import { users } from "@/lib/db/schema";
// I'm thinking move that logic out of the authorize function and into a separate function that can be tested independently.

const testUser = {
	id: "1",
	name: "Peter Keen",
	email: "pkeen7@gmail.com",
	password: "12345678",
};

export const handler = NextAuth({
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

				console.log("password: ", password);

				if (email === testUser.email) {
					console.log("email matches");
				}

				if (password === testUser.password) {
					console.log("password matches");
				}

				const user =
					email === testUser.email && password === testUser.password
						? testUser
						: null;

				return user;

				// Add logic here to look up the user from the credentials supplied
				// Check credentials against your database or an external service
				// made up testUser for now
				// console.log("reaching authorize..");

				// if (!email || !password) return null;
				// // const user =
				// // 	email === testUser.email && password === "password"
				// // 		? testUser
				// // 		: null;
				// const user = testUser; // for debugging
				// return user;
				// You can also Reject this callback with an Error thus the user will be sent to the error pa
			},
			// async authorize(credentials) {
			// 	const { email, password } = credentials || {};
			// 	if (!email || !password) return null;

			// 	const user = await db
			// 		.select(users)
			// 		.where(users.email.eq(email))
			// 		.limit(1);

			// 	if (!user || !bcrypt.compareSync(password, user[0].password)) {
			// 		throw new Error("Invalid email or password");
			// 	}

			// 	return { id: user[0].id, email: user[0].email };
			// },
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
});
