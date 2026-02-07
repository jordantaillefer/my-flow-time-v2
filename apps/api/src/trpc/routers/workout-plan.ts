import { and, count, eq } from 'drizzle-orm';
import { z } from 'zod';

import { workoutPlan, workoutPlanExercise } from '../../db/schema';
import { authedProcedure, router } from '../trpc';

export const workoutPlanRouter = router({
	list: authedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;

		const plans = await ctx.db.query.workoutPlan.findMany({
			where: eq(workoutPlan.userId, userId),
			orderBy: workoutPlan.name,
		});

		// Get exercise counts per plan
		const counts = await ctx.db
			.select({
				workoutPlanId: workoutPlanExercise.workoutPlanId,
				count: count(),
			})
			.from(workoutPlanExercise)
			.where(eq(workoutPlanExercise.userId, userId))
			.groupBy(workoutPlanExercise.workoutPlanId);

		const countMap = new Map(counts.map((c) => [c.workoutPlanId, c.count]));

		return plans.map((plan) => ({
			...plan,
			exerciseCount: countMap.get(plan.id) ?? 0,
		}));
	}),

	getById: authedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		return ctx.db.query.workoutPlan.findFirst({
			where: and(eq(workoutPlan.id, input.id), eq(workoutPlan.userId, ctx.session.user.id)),
			with: {
				exercises: {
					with: {
						exercise: true,
					},
					orderBy: (wpe, { asc }) => [asc(wpe.order)],
				},
			},
		});
	}),

	create: authedProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ ctx, input }) => {
		const id = crypto.randomUUID();
		await ctx.db.insert(workoutPlan).values({
			id,
			name: input.name,
			userId: ctx.session.user.id,
		});
		return { id };
	}),

	update: authedProcedure.input(z.object({ id: z.string(), name: z.string().min(1) })).mutation(async ({ ctx, input }) => {
		await ctx.db
			.update(workoutPlan)
			.set({ name: input.name })
			.where(and(eq(workoutPlan.id, input.id), eq(workoutPlan.userId, ctx.session.user.id)));
	}),

	delete: authedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		await ctx.db.delete(workoutPlan).where(and(eq(workoutPlan.id, input.id), eq(workoutPlan.userId, ctx.session.user.id)));
	}),
});
