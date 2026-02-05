import { z } from 'zod';

export const dayTemplateSchema = z.object({
	name: z.string().min(1, 'Nom requis'),
	color: z.string().min(1, 'Couleur requise'),
});

export type DayTemplateValues = z.infer<typeof dayTemplateSchema>;

export const templateSlotSchema = z
	.object({
		startTime: z.string().min(1, 'Heure de debut requise'),
		endTime: z.string().min(1, 'Heure de fin requise'),
		subcategoryId: z.string().min(1, 'Sous-categorie requise'),
	})
	.refine((data) => data.startTime < data.endTime, {
		message: "L'heure de fin doit etre apres l'heure de debut",
		path: ['endTime'],
	});

export type TemplateSlotValues = z.infer<typeof templateSlotSchema>;

export const DAYS_OF_WEEK = [
	{ value: 0, label: 'Lundi', short: 'L' },
	{ value: 1, label: 'Mardi', short: 'M' },
	{ value: 2, label: 'Mercredi', short: 'Me' },
	{ value: 3, label: 'Jeudi', short: 'J' },
	{ value: 4, label: 'Vendredi', short: 'V' },
	{ value: 5, label: 'Samedi', short: 'S' },
	{ value: 6, label: 'Dimanche', short: 'D' },
] as const;
