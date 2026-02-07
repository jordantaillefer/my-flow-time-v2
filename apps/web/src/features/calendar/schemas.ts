import { z } from 'zod';

export const plannedSlotSchema = z
	.object({
		startTime: z.string().min(1, 'Heure de debut requise'),
		endTime: z.string().min(1, 'Heure de fin requise'),
		subcategoryId: z.string().min(1, 'Sous-categorie requise'),
		workoutPlanId: z.string().optional(),
	})
	.refine((data) => data.startTime < data.endTime, {
		message: "L'heure de fin doit etre apres l'heure de debut",
		path: ['endTime'],
	});

export type PlannedSlotValues = z.infer<typeof plannedSlotSchema>;

export type CalendarView = 'week' | 'month';

export const calendarSearchSchema = z.object({
	view: z.enum(['week', 'month']).catch('week'),
	week: z.string().optional(),
	month: z.string().optional(),
});

export type CalendarSearch = z.infer<typeof calendarSearchSchema>;
