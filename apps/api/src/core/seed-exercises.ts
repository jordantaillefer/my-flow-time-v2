import type { DrizzleD1Database } from 'drizzle-orm/d1';

import type * as schema from '../db/schema';
import { exercise } from '../db/schema';
import { DEFAULT_EXERCISES } from './default-exercises';

export async function seedDefaultExercises(db: DrizzleD1Database<typeof schema>) {
	// Clear existing exercises and re-seed with full dataset
	await db.delete(exercise);

	for (const ex of DEFAULT_EXERCISES) {
		await db
			.insert(exercise)
			.values({
				id: crypto.randomUUID(),
				name: ex.name,
				muscleGroup: ex.muscleGroup,
				description: ex.description,
				imageUrl: ex.imageUrl ?? null,
			})
			.onConflictDoNothing();
	}
}
