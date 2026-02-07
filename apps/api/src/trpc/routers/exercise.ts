import { and, eq, like } from 'drizzle-orm';
import { z } from 'zod';

import { seedDefaultExercises } from '../../core/seed-exercises';
import { exercise } from '../../db/schema';
import { authedProcedure, router } from '../trpc';

export const exerciseRouter = router({
	list: authedProcedure
		.input(
			z
				.object({
					muscleGroup: z.string().optional(),
					equipment: z.string().optional(),
					search: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const conditions = [];

			if (input?.muscleGroup) {
				conditions.push(eq(exercise.muscleGroup, input.muscleGroup));
			}

			if (input?.equipment) {
				conditions.push(eq(exercise.equipment, input.equipment));
			}

			if (input?.search) {
				conditions.push(like(exercise.name, `%${input.search}%`));
			}

			return ctx.db.query.exercise.findMany({
				where: conditions.length > 0 ? and(...conditions) : undefined,
				orderBy: [exercise.muscleGroup, exercise.name],
			});
		}),

	seed: authedProcedure.mutation(async ({ ctx }) => {
		await seedDefaultExercises(ctx.db);
		return { ok: true };
	}),
});
