import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { readFile } from 'fs/promises';
import bcrypt from 'bcrypt';

const usersPath = path.join(process.cwd(), 'static', 'data', 'users.json');

export const POST: RequestHandler = async ({ request }) => {
  const { name, password } = await request.json();
  const usersData = await readFile(usersPath, 'utf-8');
  const users = JSON.parse(usersData);

  const user = users.find((u: any) => u.name === name);
  if (!user) return new Response('Invalid credentials!', { status: 401 });

  let valid = false;
  if (user.passwordHash.startsWith('$2')) {
    valid = await bcrypt.compare(password, user.passwordHash);
  } else {
    // legacy plain-text admin password
    valid = password === user.passwordHash;
  }
  if (!valid) return new Response('Invalid credentials!', { status: 401 });

  const { id, name: userName, budget, inventory } = user;
  return new Response(JSON.stringify({ id, name: userName, budget, inventory }), {
    headers: { 'Content-Type': 'application/json' }
  });
};