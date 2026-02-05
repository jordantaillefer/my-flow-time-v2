import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { templateRecurrence } from '../../db/schema';
import { authedProcedure, router } from '../trpc';

export const templateRecurrenceRouter = router({
	list: authedProcedure.query(async ({ ctx }) => {
		return ctx.db.query.templateRecurrence.findMany({
			where: eq(templateRecurrence.userId, ctx.session.user.id),
			with: { template: true },
		});
	}),

	set: authedProcedure
		.input(
			z.object({
				templateId: z.string(),
				dayOfWeek: z.number().int().min(0).max(6),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Remove existing assignment for this day
			await ctx.db
				.delete(templateRecurrence)
				.where(
					and(eq(templateRecurrence.dayOfWeek, input.dayOfWeek), eq(templateRecurrence.userId, ctx.session.user.id)),
				);
			// Insert new assignment
			const id = crypto.randomUUID();
			await ctx.db.insert(templateRecurrence).values({
				id,
				dayOfWeek: input.dayOfWeek,
				templateId: input.templateId,
				userId: ctx.session.user.id,
			});
			return { id };
		}),

	unset: authedProcedure
		.input(z.object({ dayOfWeek: z.number().int().min(0).max(6) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.delete(templateRecurrence)
				.where(
					and(eq(templateRecurrence.dayOfWeek, input.dayOfWeek), eq(templateRecurrence.userId, ctx.session.user.id)),
				);
		}),
});
