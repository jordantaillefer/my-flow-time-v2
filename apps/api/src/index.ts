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

export default app;
