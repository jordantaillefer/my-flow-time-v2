import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { workoutSet } from '../../db/schema';
import { authedProcedure, router } from '../trpc';

export const workoutSetRouter = router({
	log: authedProcedure
		.input(
			z.object({
				sessionId: z.string(),
				exerciseId: z.string(),
				workoutPlanExerciseId: z.string(),
				setNumber: z.number().int(),
				reps: z.number().int().min(0),
				weight: z.number().min(0),
				feeling: z.number().int().min(1).max(5),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const id = crypto.randomUUID();
			await ctx.db.insert(workoutSet).values({
				id,
				setNumber: input.setNumber,
				reps: input.reps,
				weight: input.weight,
				feeling: input.feeling,
				sessionId: input.sessionId,
				exerciseId: input.exerciseId,
				workoutPlanExerciseId: input.workoutPlanExerciseId,
				userId: ctx.session.user.id,
			});
			return { id };
		}),

	update: authedProcedure
		.input(
			z.object({
				id: z.string(),
				reps: z.number().int().min(0),
				weight: z.number().min(0),
				feeling: z.number().int().min(1).max(5),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(workoutSet)
				.set({
					reps: input.reps,
					weight: input.weight,
					feeling: input.feeling,
				})
				.where(and(eq(workoutSet.id, input.id), eq(workoutSet.userId, ctx.session.user.id)));
		}),

	delete: authedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		await ctx.db.delete(workoutSet).where(and(eq(workoutSet.id, input.id), eq(workoutSet.userId, ctx.session.user.id)));
	}),
});
