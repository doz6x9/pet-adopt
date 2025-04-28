// src/routes/api/pets/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { Pet } from '$lib/types';

const petsPath  = path.join(process.cwd(), 'static', 'data', 'pets.json');
const usersPath = path.join(process.cwd(), 'static', 'data', 'users.json');

export const GET: RequestHandler = async ({ url }) => {
  const typeParam  = url.searchParams.get('type');
  const ownerParam = url.searchParams.get('ownerId');

  const raw = await readFile(petsPath, 'utf-8');
  let pets: Pet[] = JSON.parse(raw);

  if (typeParam) {
    pets = pets.filter(p => p.type === typeParam);
  }
  if (ownerParam) {
    pets = pets.filter(p => p.ownerId === +ownerParam);
  }

  return json(pets);
};

export const POST: RequestHandler = async ({ request }) => {
  const { name, picture, type, userId } = await request.json() as {
    name: string; picture: string; type: string; userId?: number;
  };

  // 1) Admin‐only guard
  const usersRaw = await readFile(usersPath, 'utf-8');
  const users    = JSON.parse(usersRaw) as any[];
  const user     = users.find(u => u.id === userId);
  if (!user)       return new Response('User not found', { status: 404 });
  if (user.name !== 'admin') return new Response('Forbidden: admin only', { status: 403 });

  // 2) Validate
  if (!name || !picture || !type) {
    return new Response('Missing required fields', { status: 400 });
  }

  // 3) Append new pet
  const data = await readFile(petsPath, 'utf-8');
  const pets = JSON.parse(data) as Pet[];
  const newPet: Pet = {
    id: Date.now(),
    name,
    picture,
    type,
    adopted: false,
    hunger: 50,
    happiness: 50,
    ownerId: null
  };
  pets.push(newPet);
  await writeFile(petsPath, JSON.stringify(pets, null, 2));

  return new Response(JSON.stringify(newPet), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
};
