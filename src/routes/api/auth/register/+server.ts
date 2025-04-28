import type { RequestHandler } from '@sveltejs/kit';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json();

	const usersData = await readFile(usersPath, 'utf-8');
	const users = JSON.parse(usersData);

	// Check if user name already exists
	if (users.some((u: any) => u.name === name)) {
		return new Response('User already exists', { status: 400 });
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create new user object
	const newUser = {
		id: Date.now(), // simple unique ID
		name,
		passwordHash: hashedPassword,
		budget: 100, // starting budget
		inventory: {
			food: 0,
			toy: 0,
			treat: 0
		}
	};

	users.push(newUser);

	await writeFile(usersPath, JSON.stringify(users, null, 2));

	// Return user info without passwordHash
	return new Response(JSON.stringify({
		id: newUser.id,
		name: newUser.name,
		budget: newUser.budget,
		inventory: newUser.inventory
	}), {
		headers: { 'Content-Type': 'application/json' }
	});
};
