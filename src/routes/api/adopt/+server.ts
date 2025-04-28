// src/routes/api/adopt/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const petsPath  = path.join(process.cwd(), 'static', 'data', 'pets.json');
const usersPath = path.join(process.cwd(), 'static', 'data', 'users.json');
const logPath   = path.join(process.cwd(), 'static', 'data', 'log.json');

export const POST: RequestHandler = async ({ request }) => {
  const { petId, userId } = await request.json();

  // 1) Load data
  const [petsData, usersData, logsData] = await Promise.all([
    readFile(petsPath,  'utf-8'),
    readFile(usersPath, 'utf-8'),
    readFile(logPath,   'utf-8')
  ]);
  const pets  = JSON.parse(petsData)  as any[];
  const users = JSON.parse(usersData) as any[];
  const logs  = JSON.parse(logsData)  as any[];

  // 2) Find pet & user
  const pet  = pets.find(p => p.id === petId);
  const user = users.find(u => u.id === userId);
  if (!pet)  return new Response('Pet not found',  { status: 404 });
  if (!user) return new Response('User not found', { status: 404 });
  if (pet.adopted) return new Response('Pet already adopted', { status: 400 });

  // 3) Mark as adopted
  pet.adopted = true;
  pet.ownerId = userId;

  // 4) Persist pets.json
  await writeFile(petsPath, JSON.stringify(pets, null, 2));

  // 5) Log it
  logs.unshift({ message: `${user.name} adopted ${pet.name}`, timestamp: new Date().toISOString() });
  await writeFile(logPath, JSON.stringify(logs, null, 2));

  // 6) Respond
  return new Response('Pet adopted successfully', { status: 200 });
};
