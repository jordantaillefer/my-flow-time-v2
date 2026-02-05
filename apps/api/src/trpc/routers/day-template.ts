import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { dayTemplate } from '../../db/schema';
import { authedProcedure, router } from '../trpc';

export const dayTemplateRouter = router({
	list: authedProcedure.query(async ({ ctx }) => {
		return ctx.db.query.dayTemplate.findMany({
			where: eq(dayTemplate.userId, ctx.session.user.id),
			with: {
				slots: {
					with: {
						subcategory: {
							with: { category: true },
						},
					},
					orderBy: (slot, { asc }) => [asc(slot.order)],
				},
				recurrences: true,
			},
			orderBy: dayTemplate.name,
		});
	}),

	getById: authedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		return ctx.db.query.dayTemplate.findFirst({
			where: and(eq(dayTemplate.id, input.id), eq(dayTemplate.userId, ctx.session.user.id)),
			with: {
				slots: {
					with: {
						subcategory: {
							with: { category: true },
						},
					},
					orderBy: (slot, { asc }) => [asc(slot.order)],
				},
				recurrences: true,
			},
		});
	}),

	create: authedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				color: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const id = crypto.randomUUID();
			await ctx.db.insert(dayTemplate).values({
				id,
				name: input.name,
				color: input.color,
				userId: ctx.session.user.id,
			});
			return { id };
		}),

	update: authedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1),
				color: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(dayTemplate)
				.set({ name: input.name, color: input.color })
				.where(and(eq(dayTemplate.id, input.id), eq(dayTemplate.userId, ctx.session.user.id)));
		}),

	delete: authedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		await ctx.db
			.delete(dayTemplate)
			.where(and(eq(dayTemplate.id, input.id), eq(dayTemplate.userId, ctx.session.user.id)));
	}),
});
