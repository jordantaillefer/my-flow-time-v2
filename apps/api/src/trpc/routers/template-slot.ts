import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { templateSlot } from '../../db/schema';
import { authedProcedure, router } from '../trpc';

export const templateSlotRouter = router({
	create: authedProcedure
		.input(
			z.object({
				templateId: z.string(),
				startTime: z.string().min(1),
				endTime: z.string().min(1),
				subcategoryId: z.string(),
				order: z.number().int(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const id = crypto.randomUUID();
			await ctx.db.insert(templateSlot).values({
				id,
				startTime: input.startTime,
				endTime: input.endTime,
				order: input.order,
				subcategoryId: input.subcategoryId,
				templateId: input.templateId,
				userId: ctx.session.user.id,
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
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(templateSlot)
				.set({
					startTime: input.startTime,
					endTime: input.endTime,
					subcategoryId: input.subcategoryId,
					order: input.order,
				})
				.where(and(eq(templateSlot.id, input.id), eq(templateSlot.userId, ctx.session.user.id)));
		}),

	delete: authedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		await ctx.db.delete(templateSlot).where(and(eq(templateSlot.id, input.id), eq(templateSlot.userId, ctx.session.user.id)));
	}),

	reorder: authedProcedure.input(z.array(z.object({ id: z.string(), order: z.number().int() }))).mutation(async ({ ctx, input }) => {
		await Promise.all(
			input.map((item) =>
				ctx.db
					.update(templateSlot)
					.set({ order: item.order })
					.where(and(eq(templateSlot.id, item.id), eq(templateSlot.userId, ctx.session.user.id))),
			),
		);
	}),
});
