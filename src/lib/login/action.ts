"use server";
import { z } from "zod";

const testUser = {
	email: "pkeen7@gmail.com",
	password: "abcd",
};

const loginSchema = z.object({
	email: z.string().email({ message: "Email address invalid" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" }), // make min 3 for now
});

const responseSchema = z.object({
	message: z.string(),
	data: z.object({
		email: z.string(),
		password: z.string(),
	}),
	errors: z
		.object({
			email: z.array(z.string()).optional(),
			password: z.array(z.string()).optional(),
            db: z.string().optional(),
		})
		.optional(),
});

type response = z.infer<typeof responseSchema>;

export const login = async (previous: unknown, formData: FormData) => {
	const data = Object.fromEntries(formData) as {
		email: string;
		password: string;
	};
	const result = loginSchema.safeParse(data);
	console.log(result);


    // validation
	if (!result.success) {
		// Extract errors from result.error
		const fieldErrors = result.error.flatten().fieldErrors;
		// Create meaningful feedback
		// Example: Display or use the error messages
		const response: response = {
			message: "Validation failed",
			data: data,
			errors: fieldErrors,
		};
		console.log(response);
		return response;
	} else {
        // Example: Check if user exists in database
        if (data.email !== testUser.email || data.password !== testUser.password) {
            const response: response = {
                message: "Email or password incorrect",
                data: data,
                errors: {
                    db: "Email or password incorrect",
                }
            };
            console.log(response);
            return response;
        } else {
            // user found - return user
            const response: response = {
                message: "Validation passed",
                data: data,
            };
            console.log(response);
            return response;
        }
	}
};
