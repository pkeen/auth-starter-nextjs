import type { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { faker } from "@faker-js/faker";

const seedUsers = async (db: db) => {
	const spoofUserArray = [];

	for (let i = 0; i < 10; i++) {
		const spoofUser = {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
            image: faker.image.avatar(),
		};
		spoofUserArray.push(spoofUser);
	}

	try {
		await db.insert(schema.users).values(spoofUserArray);
		console.log("users succesfully seeded...");
	} catch (error) {
		console.error("Error inserting user:", error);
	}
};
// seedUsers();

export default seedUsers;