import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { category, subcategory } from '../../db/schema';
import { authedProcedure, router } from '../trpc';

export const categoryRouter = router({
	list: authedProcedure.query(async ({ ctx }) => {
		return ctx.db.query.category.findMany({
			where: eq(category.userId, ctx.session.user.id),
			with: { subcategories: true },
			orderBy: category.name,
		});
	}),

	create: authedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				icon: z.string().min(1),
				color: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const id = crypto.randomUUID();
			await ctx.db.insert(category).values({
				id,
				name: input.name,
				icon: input.icon,
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
				icon: z.string().min(1),
				color: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(category)
				.set({ name: input.name, icon: input.icon, color: input.color })
				.where(and(eq(category.id, input.id), eq(category.userId, ctx.session.user.id)));
		}),

	delete: authedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const cat = await ctx.db.query.category.findFirst({
				where: and(eq(category.id, input.id), eq(category.userId, ctx.session.user.id)),
			});
			if (cat?.isDefault) {
				throw new Error('Impossible de supprimer une categorie par defaut');
			}
			await ctx.db.delete(category).where(and(eq(category.id, input.id), eq(category.userId, ctx.session.user.id)));
		}),
});

export const subcategoryRouter = router({
	create: authedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				categoryId: z.string(),
				moduleType: z.string().nullable().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const id = crypto.randomUUID();
			await ctx.db.insert(subcategory).values({
				id,
				name: input.name,
				categoryId: input.categoryId,
				moduleType: input.moduleType ?? null,
				userId: ctx.session.user.id,
			});
			return { id };
		}),

	update: authedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1),
				moduleType: z.string().nullable().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(subcategory)
				.set({ name: input.name, moduleType: input.moduleType ?? null })
				.where(and(eq(subcategory.id, input.id), eq(subcategory.userId, ctx.session.user.id)));
		}),

	delete: authedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const sub = await ctx.db.query.subcategory.findFirst({
				where: and(eq(subcategory.id, input.id), eq(subcategory.userId, ctx.session.user.id)),
			});
			if (sub?.isDefault) {
				throw new Error('Impossible de supprimer une sous-categorie par defaut');
			}
			await ctx.db.delete(subcategory).where(and(eq(subcategory.id, input.id), eq(subcategory.userId, ctx.session.user.id)));
		}),
});
