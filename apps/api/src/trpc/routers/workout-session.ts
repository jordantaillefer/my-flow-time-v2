import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { workoutSession } from '../../db/schema';
import { authedProcedure, router } from '../trpc';

export const workoutSessionRouter = router({
	start: authedProcedure
		.input(
			z.object({
				workoutPlanId: z.string(),
				plannedSlotId: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const id = crypto.randomUUID();
			await ctx.db.insert(workoutSession).values({
				id,
				workoutPlanId: input.workoutPlanId,
				plannedSlotId: input.plannedSlotId ?? null,
				userId: ctx.session.user.id,
			});
			return { id };
		}),

	getById: authedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		return ctx.db.query.workoutSession.findFirst({
			where: and(eq(workoutSession.id, input.id), eq(workoutSession.userId, ctx.session.user.id)),
			with: {
				workoutPlan: {
					with: {
						exercises: {
							with: { exercise: true },
							orderBy: (wpe, { asc }) => [asc(wpe.order)],
						},
					},
				},
				sets: {
					orderBy: (s, { asc }) => [asc(s.completedAt)],
				},
			},
		});
	}),

	complete: authedProcedure.input(z.object({ id: z.string(), notes: z.string().optional() })).mutation(async ({ ctx, input }) => {
		await ctx.db
			.update(workoutSession)
			.set({
				status: 'completed',
				completedAt: new Date(),
				...(input.notes !== undefined ? { notes: input.notes } : {}),
			})
			.where(and(eq(workoutSession.id, input.id), eq(workoutSession.userId, ctx.session.user.id)));
	}),

	abandon: authedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		await ctx.db
			.update(workoutSession)
			.set({ status: 'abandoned', completedAt: new Date() })
			.where(and(eq(workoutSession.id, input.id), eq(workoutSession.userId, ctx.session.user.id)));
	}),

	listByPlan: authedProcedure.input(z.object({ workoutPlanId: z.string() })).query(async ({ ctx, input }) => {
		return ctx.db.query.workoutSession.findMany({
			where: and(eq(workoutSession.workoutPlanId, input.workoutPlanId), eq(workoutSession.userId, ctx.session.user.id)),
			orderBy: desc(workoutSession.startedAt),
		});
	}),

	listHistory: authedProcedure
		.input(
			z.object({
				limit: z.number().int().min(1).max(50).default(10),
				offset: z.number().int().min(0).default(0),
				exerciseId: z.string().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			let sessions = await ctx.db.query.workoutSession.findMany({
				where: and(eq(workoutSession.userId, userId), eq(workoutSession.status, 'completed')),
				orderBy: desc(workoutSession.startedAt),
				with: {
					workoutPlan: true,
					sets: {
						with: { exercise: true },
						orderBy: (s, { asc }) => [asc(s.completedAt)],
					},
				},
			});

			// Filter sessions that have at least one set with the given exerciseId
			if (input.exerciseId) {
				sessions = sessions.filter((s) => s.sets.some((set) => set.exerciseId === input.exerciseId));
			}

			const total = sessions.length;
			const paginated = sessions.slice(input.offset, input.offset + input.limit);

			return { sessions: paginated, total };
		}),

	getActive: authedProcedure.query(async ({ ctx }) => {
		return (
			ctx.db.query.workoutSession.findFirst({
				where: and(eq(workoutSession.userId, ctx.session.user.id), eq(workoutSession.status, 'in_progress')),
			}) ?? null
		);
	}),
});
