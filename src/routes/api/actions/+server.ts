// src/routes/api/actions/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const petsPath  = path.join(process.cwd(), 'static', 'data', 'pets.json');
const usersPath = path.join(process.cwd(), 'static', 'data', 'users.json');
const logPath   = path.join(process.cwd(), 'static', 'data', 'log.json');

export const POST: RequestHandler = async ({ request }) => {
  const { petId, action, userId } = await request.json();

  // 1) Load current data
  const [petsData, usersData, logsData] = await Promise.all([
    readFile(petsPath,  'utf-8'),
    readFile(usersPath, 'utf-8'),
    readFile(logPath,   'utf-8'),
  ]);
  const pets  = JSON.parse(petsData)  as any[];
  const users = JSON.parse(usersData) as any[];
  const logs  = JSON.parse(logsData)  as any[];

  // 2) Find our pet and user
  const pet  = pets.find(p => p.id === petId);
  const user = users.find(u => u.id === userId);
  if (!pet || !user) {
    return new Response('Pet or User not found!', { status: 404 });
  }

  // 3) Perform the requested action
  let logMessage = '';
  switch (action) {
    case 'feed': {
      // use food inventory first, else spend $5
      if (user.inventory.food > 0) {
        user.inventory.food -= 1;
        logMessage = `${user.name} fed ${pet.name} (used 1 food)`;
      } else if (user.budget >= 5) {
        user.budget -= 5;
        logMessage = `${user.name} fed ${pet.name} (−$5)`;
      } else {
        return new Response('Not enough food or budget to feed.', { status: 400 });
      }
      pet.hunger = Math.max(0, pet.hunger - 20);
      break;
    }

    case 'toy': {
      // use toy inventory first, else spend $10
      if (user.inventory.toy > 0) {
        user.inventory.toy -= 1;
        logMessage = `${user.name} played with ${pet.name} (used 1 toy)`;
      } else if (user.budget >= 10) {
        user.budget -= 10;
        logMessage = `${user.name} played with ${pet.name} (−$10)`;
      } else {
        return new Response('Not enough toys or budget to play.', { status: 400 });
      }
      pet.happiness = Math.min(100, pet.happiness + 30);
      break;
    }

    case 'return':
      pet.adopted = false;
      delete pet.ownerId;
      user.budget += 20;
      logMessage = `${user.name} returned ${pet.name} (+$20)`;
      break;

    default:
      return new Response('Invalid action!', { status: 400 });
  }

  // 4) Prepend to the log and persist everything
  logs.unshift({ message: logMessage, timestamp: new Date().toISOString() });
  await Promise.all([
    writeFile(petsPath,  JSON.stringify(pets,  null, 2)),
    writeFile(usersPath, JSON.stringify(users, null, 2)),
    writeFile(logPath,   JSON.stringify(logs,  null, 2))
  ]);

  return new Response('Success!', { status: 200 });
};
