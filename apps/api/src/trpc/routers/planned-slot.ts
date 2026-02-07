import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { plannedDay, plannedSlot } from '../../db/schema';
import { authedProcedure, router } from '../trpc';

export const plannedSlotRouter = router({
	create: authedProcedure
		.input(
			z.object({
				date: z.string(),
				startTime: z.string().min(1),
				endTime: z.string().min(1),
				subcategoryId: z.string(),
				order: z.number().int(),
				workoutPlanId: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			// Find or create the planned day
			let day = await ctx.db.query.plannedDay.findFirst({
				where: and(eq(plannedDay.date, input.date), eq(plannedDay.userId, userId)),
			});

			if (!day) {
				const dayId = crypto.randomUUID();
				await ctx.db.insert(plannedDay).values({
					id: dayId,
					date: input.date,
					userId,
				});
				day = { id: dayId, date: input.date, templateId: null, userId, createdAt: new Date() };
			}

			const id = crypto.randomUUID();
			await ctx.db.insert(plannedSlot).values({
				id,
				startTime: input.startTime,
				endTime: input.endTime,
				order: input.order,
				subcategoryId: input.subcategoryId,
				plannedDayId: day.id,
				workoutPlanId: input.workoutPlanId ?? null,
				userId,
			});
			return { id };
		}),

	update: authedProcedure
		.input(
			z.object({
				id: z.string(),
				startTime: z.string().min(1),
				endTime: z.string().min(1),
				subcategoryId: z.string(),
				order: z.number().int(),
				workoutPlanId: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(plannedSlot)
				.set({
					startTime: input.startTime,
					endTime: input.endTime,
					subcategoryId: input.subcategoryId,
					order: input.order,
					templateSlotId: null, // Detach from template slot on edit
					workoutPlanId: input.workoutPlanId ?? null,
				})
				.where(and(eq(plannedSlot.id, input.id), eq(plannedSlot.userId, ctx.session.user.id)));
		}),

	delete: authedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		await ctx.db
			.delete(plannedSlot)
			.where(and(eq(plannedSlot.id, input.id), eq(plannedSlot.userId, ctx.session.user.id)));
	}),
});
