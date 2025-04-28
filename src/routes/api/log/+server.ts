import type { RequestHandler } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import path from 'path';

const logPath = path.join(process.cwd(), 'static', 'data', 'log.json');

export const GET: RequestHandler = async () => {
  try {
    const data = await readFile(logPath, 'utf-8');
    const logs = JSON.parse(data);
    return new Response(JSON.stringify(logs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response('Failed to load logs', { status: 500 });
  }
}