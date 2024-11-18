// "use server";
import { signIn } from "next-auth/react";
import { validate, response, data } from "./validate";

export const login = async (previous: unknown, formData: FormData) => {
	const data = Object.fromEntries(formData) as data;

	let result: response = validate(data);

	// If validation fails return the result object containing the error
	if (!result.validated) {
		return result;
	}

	// SEND DATA TO AUTHORIZE FUNCTION DEFINED IN AUTH
	const auth = await signIn("credentials", {
		redirect: false,
		email: data.email,
		password: data.password,
	});

	// check if res is ok
	if (!auth?.ok) {
		result = {
			...result,
			authorized: false,
			errors: {
				db: "Email or password incorrect",
			},
		};
		return result;
	} else {
		result = {
			...result,
			authorized: true,
		};
		return result;
	}
};
