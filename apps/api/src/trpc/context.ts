import type { DrizzleD1Database } from 'drizzle-orm/d1';

import type * as schema from '../db/schema';

export interface SessionUser {
	id: string;
	name: string;
	email: string;
	image?: string | null;
}

export interface Context {
	req: Request;
	db: DrizzleD1Database<typeof schema>;
	session: { user: SessionUser } | null;
}
