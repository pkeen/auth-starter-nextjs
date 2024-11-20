"use server";
import { validate, response, data } from "./validate";
import { signIn } from "@/auth";

export const login = async (previous: unknown, formData: FormData) => {
	const data = Object.fromEntries(formData) as data;

	let result: response = validate(data);

	// If validation fails return the result object containing the error
	if (!result.validated) {
		return result;
	}

	// SEND DATA TO AUTHORIZE FUNCTION DEFINED IN AUTH
	try {
		const user = await signIn("credentials", {
			redirect: false,
			email: data.email,
			password: data.password,
		});
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
};
