import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { Hono } from 'hono';

import { auth } from './auth';
import { db } from './db';
import type { Context } from './trpc/context';
import { appRouter } from './trpc/router';

const app = new Hono();

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

app.all('/api/trpc/*', (c) => {
	return fetchRequestHandler({
		endpoint: '/api/trpc',
		req: c.req.raw,
		router: appRouter,
		createContext: async ({ req }): Promise<Context> => {
			const result = await auth.api.getSession({ headers: req.headers });
			return {
				req,
				db,
				session: result ? { user: result.user } : null,
			};
		},
	});
});

// SPA fallback: non-API routes → index.html (only in deployed environment)
app.get('*', async (c) => {
	const assets = (c.env as Record<string, unknown>).ASSETS as
		| { fetch: (req: Request) => Promise<Response> }
		| undefined;
	if (!assets) return c.notFound();
	const url = new URL(c.req.url);
	url.pathname = '/index.html';
	return assets.fetch(new Request(url, c.req.raw));
});

export default app;
