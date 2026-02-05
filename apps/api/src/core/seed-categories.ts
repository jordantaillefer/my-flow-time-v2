import type { DrizzleD1Database } from 'drizzle-orm/d1';

import type * as schema from '../db/schema';
import { category, subcategory } from '../db/schema';
import { DEFAULT_CATEGORIES } from './default-categories';

export async function seedDefaultCategories(db: DrizzleD1Database<typeof schema>, userId: string) {
	for (const cat of DEFAULT_CATEGORIES) {
		const catId = crypto.randomUUID();
		await db.insert(category).values({
			id: catId,
			name: cat.name,
			icon: cat.icon,
			color: cat.color,
			isDefault: true,
			userId,
		});

		for (const sub of cat.subcategories) {
			await db.insert(subcategory).values({
				id: crypto.randomUUID(),
				name: sub.name,
				moduleType: sub.moduleType,
				isDefault: true,
				categoryId: catId,
				userId,
			});
		}
	}
}
