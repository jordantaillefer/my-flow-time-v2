import { and, eq, gte, lte } from 'drizzle-orm';
import { z } from 'zod';

import { generateDateRange, getTemplateForDate } from '../../core/calendar';
import { dayTemplate, plannedDay, plannedSlot, templateRecurrence, templateSlot } from '../../db/schema';
import { authedProcedure, router } from '../trpc';

export const plannedDayRouter = router({
	getRange: authedProcedure
		.input(
			z.object({
				startDate: z.string(),
				endDate: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			const dates = generateDateRange(input.startDate, input.endDate);

			// Fetch existing planned days in range
			const existingDays = await ctx.db.query.plannedDay.findMany({
				where: and(
					eq(plannedDay.userId, userId),
					gte(plannedDay.date, input.startDate),
					lte(plannedDay.date, input.endDate),
				),
				with: {
					slots: {
						with: {
							subcategory: { with: { category: true } },
						},
						orderBy: (slot, { asc }) => [asc(slot.order)],
					},
					template: true,
				},
			});

			const existingByDate = new Map(existingDays.map((d) => [d.date, d]));
			const missingDates = dates.filter((d) => !existingByDate.has(d));

			if (missingDates.length === 0) {
				return existingDays;
			}

			// Fetch recurrences to auto-generate days
			const recurrences = await ctx.db.query.templateRecurrence.findMany({
				where: eq(templateRecurrence.userId, userId),
			});

			// Generate missing days from recurrences
			for (const dateStr of missingDates) {
				const tplId = getTemplateForDate(dateStr, recurrences);
				const dayId = crypto.randomUUID();

				await ctx.db.insert(plannedDay).values({
					id: dayId,
					date: dateStr,
					templateId: tplId,
					userId,
				});

				// Copy slots from the assigned template
				if (tplId) {
					const tplSlots = await ctx.db.query.templateSlot.findMany({
						where: and(eq(templateSlot.templateId, tplId), eq(templateSlot.userId, userId)),
						orderBy: (slot, { asc }) => [asc(slot.order)],
					});

					for (const ts of tplSlots) {
						await ctx.db.insert(plannedSlot).values({
							id: crypto.randomUUID(),
							startTime: ts.startTime,
							endTime: ts.endTime,
							order: ts.order,
							subcategoryId: ts.subcategoryId,
							plannedDayId: dayId,
							templateSlotId: ts.id,
							userId,
						});
					}
				}
			}

			// Re-fetch all days with full relations
			return ctx.db.query.plannedDay.findMany({
				where: and(
					eq(plannedDay.userId, userId),
					gte(plannedDay.date, input.startDate),
					lte(plannedDay.date, input.endDate),
				),
				with: {
					slots: {
						with: {
							subcategory: { with: { category: true } },
						},
						orderBy: (slot, { asc }) => [asc(slot.order)],
					},
					template: true,
				},
			});
		}),

	applyTemplate: authedProcedure
		.input(
			z.object({
				date: z.string(),
				templateId: z.string(),
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
					templateId: input.templateId,
					userId,
				});
				day = { id: dayId, date: input.date, templateId: input.templateId, userId, createdAt: new Date() };
			} else {
				// Delete existing slots
				await ctx.db
					.delete(plannedSlot)
					.where(and(eq(plannedSlot.plannedDayId, day.id), eq(plannedSlot.userId, userId)));
				// Update template reference
				await ctx.db
					.update(plannedDay)
					.set({ templateId: input.templateId })
					.where(eq(plannedDay.id, day.id));
			}

			// Copy slots from template
			const tplSlots = await ctx.db.query.templateSlot.findMany({
				where: and(eq(templateSlot.templateId, input.templateId), eq(templateSlot.userId, userId)),
				orderBy: (slot, { asc }) => [asc(slot.order)],
			});

			for (const ts of tplSlots) {
				await ctx.db.insert(plannedSlot).values({
					id: crypto.randomUUID(),
					startTime: ts.startTime,
					endTime: ts.endTime,
					order: ts.order,
					subcategoryId: ts.subcategoryId,
					plannedDayId: day.id,
					templateSlotId: ts.id,
					userId,
				});
			}
		}),

	clearDay: authedProcedure
		.input(z.object({ date: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			const day = await ctx.db.query.plannedDay.findFirst({
				where: and(eq(plannedDay.date, input.date), eq(plannedDay.userId, userId)),
			});

			if (!day) return;

			await ctx.db
				.delete(plannedSlot)
				.where(and(eq(plannedSlot.plannedDayId, day.id), eq(plannedSlot.userId, userId)));

			await ctx.db.update(plannedDay).set({ templateId: null }).where(eq(plannedDay.id, day.id));
		}),
});
