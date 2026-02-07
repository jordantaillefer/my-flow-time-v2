import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { workoutPlanExercise } from '../../db/schema';
import { authedProcedure, router } from '../trpc';

export const workoutPlanExerciseRouter = router({
	add: authedProcedure
		.input(
			z.object({
				workoutPlanId: z.string(),
				exerciseId: z.string(),
				order: z.number().int(),
				plannedSets: z.number().int().min(1).default(3),
				plannedReps: z.number().int().min(1).default(10),
				plannedWeight: z.number().min(0).default(0),
				plannedRestSeconds: z.number().int().min(0).default(90),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const id = crypto.randomUUID();
			await ctx.db.insert(workoutPlanExercise).values({
				id,
				exerciseId: input.exerciseId,
				order: input.order,
				plannedSets: input.plannedSets,
				plannedReps: input.plannedReps,
				plannedWeight: input.plannedWeight,
				plannedRestSeconds: input.plannedRestSeconds,
				workoutPlanId: input.workoutPlanId,
				userId: ctx.session.user.id,
			});
			return { id };
		}),

	update: authedProcedure
		.input(
			z.object({
				id: z.string(),
				plannedSets: z.number().int().min(1),
				plannedReps: z.number().int().min(1),
				plannedWeight: z.number().min(0),
				plannedRestSeconds: z.number().int().min(0),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(workoutPlanExercise)
				.set({
					plannedSets: input.plannedSets,
					plannedReps: input.plannedReps,
					plannedWeight: input.plannedWeight,
					plannedRestSeconds: input.plannedRestSeconds,
				})
				.where(and(eq(workoutPlanExercise.id, input.id), eq(workoutPlanExercise.userId, ctx.session.user.id)));
		}),

	remove: authedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		await ctx.db
			.delete(workoutPlanExercise)
			.where(and(eq(workoutPlanExercise.id, input.id), eq(workoutPlanExercise.userId, ctx.session.user.id)));
	}),

	reorder: authedProcedure.input(z.array(z.object({ id: z.string(), order: z.number().int() }))).mutation(async ({ ctx, input }) => {
		await Promise.all(
			input.map((item) =>
				ctx.db
					.update(workoutPlanExercise)
					.set({ order: item.order })
					.where(and(eq(workoutPlanExercise.id, item.id), eq(workoutPlanExercise.userId, ctx.session.user.id))),
			),
		);
	}),
});
