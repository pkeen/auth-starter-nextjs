import { z } from "zod";

export const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	NODE_ENV: z.string().default("development"),
	AUTH_URL: z.string().url(),
	AUTH_SECRET: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error(
		"❌ Environment variable validation error:",
		parsedEnv.error.format()
	);
	process.exit(1);
}

export const env = parsedEnv.data;
