import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { seedDefaultCategories } from './core/seed-categories';
import { db } from './db';

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	database: drizzleAdapter(db, {
		provider: 'sqlite',
	}),
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					await seedDefaultCategories(db, user.id);
				},
			},
		},
	},
});
