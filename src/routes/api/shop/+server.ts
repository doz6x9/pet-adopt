// src/routes/api/shop/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { SafeUser } from '$lib/types';

const usersPath = path.join(process.cwd(), 'static', 'data', 'users.json');

const PRICES: Record<'food' | 'toy' | 'treat', number> = {
  food: 5,
  toy: 10,
  treat: 3
};

export const POST: RequestHandler = async ({ request }) => {
  const { userId, item } = await request.json() as { userId: number; item: 'food' | 'toy' | 'treat' };

  if (!PRICES[item]) {
    return new Response('Invalid item', { status: 400 });
  }

  // load users
  const raw = await readFile(usersPath, 'utf-8');
  const users = JSON.parse(raw) as any[];
  const user  = users.find(u => u.id === userId);
  if (!user) return new Response('User not found', { status: 404 });

  const cost = PRICES[item];
  if (user.budget < cost) {
    return new Response('Not enough budget to buy ' + item, { status: 400 });
  }

  // spend & increment inventory
  user.budget -= cost;
  user.inventory[item] = (user.inventory[item] || 0) + 1;

  // persist
  await writeFile(usersPath, JSON.stringify(users, null, 2));

  // return updated safe user
  const safe: SafeUser = {
    id:        user.id,
    name:      user.name,
    budget:    user.budget,
    inventory: user.inventory
  };

  return new Response(JSON.stringify(safe), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
