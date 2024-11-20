"use server";
import { validate, response, data } from "./validate";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export const login = async (previous: unknown, formData: FormData) => {
	const data = Object.fromEntries(formData) as data;

	let result: response = validate(data);

	// If validation fails return the result object containing the error
	if (!result.validated) {
		return result;
	}

	// SEND DATA TO AUTHORIZE FUNCTION DEFINED IN AUTH
	try {
		await signIn("credentials", {
			// callbackUrl: "/", // Replace with your desired post-login URL
			// redirectTo: "/",
			redirect: false,
			email: data.email,
			password: data.password,
		});
		// console.log(user);
		result = {
			...result,
			authorized: true,
		};
		// redirect("/");
		console.log(result);
		// return user;
	} catch (err) {
		result = {
			...result,
			authorized: false,
			errors: {
				db: "Email or password incorrect",
			},
		};
		console.log(result);
		return result;
	}

	redirect("/");
};
