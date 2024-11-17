"use server";
import { error } from "console";
import { z } from "zod";

const testUser = {
	email: "pkeen7@gmail.com",
	password: "abcd",
};

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(3), // make min 3 for now
});

const errorSchema = z.object({
	field: z.string(),
	message: z.string(),
});

type error = z.infer<typeof errorSchema>;

const responseSchema = z.object({
	message: z.string(),
	data: z.object({
        email: z.string(),
        password: z.string(),   
    }),
	errors: z.array(errorSchema).optional(),
});

type response = z.infer<typeof responseSchema>;

export const login = async (previous: unknown, formData: FormData) => {
	const data = Object.fromEntries(formData) as { email: string; password: string };
	const result = loginSchema.safeParse(data);
	console.log(result);

	if (!result.success) {
		// Extract errors from result.error
		const errors = result.error.errors;
		// Create meaningful feedback
		const errorMessages = errors.map((error) => {
			return {
				field: String(error.path[0]), // Ensure field is a string
				message: error.message, // Zod's validation message
			};
		});
		// Example: Display or use the error messages
		const response: response = {
			message: "Validation failed",
            data: data,
			errors: errorMessages,
		};
        console.log(response);
		return response;
	} else {
        const response: response = {
			message: "Validation passed",
			data: data,
		};
        console.log(response);
		return response
	}
};
