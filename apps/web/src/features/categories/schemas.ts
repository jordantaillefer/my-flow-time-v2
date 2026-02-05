import { z } from 'zod';

export const categorySchema = z.object({
	name: z.string().min(1, 'Nom requis'),
	icon: z.string().min(1, 'Icone requise'),
	color: z.string().min(1, 'Couleur requise'),
});

export type CategoryValues = z.infer<typeof categorySchema>;

export const subcategorySchema = z.object({
	name: z.string().min(1, 'Nom requis'),
	moduleType: z.string().nullable().optional(),
});

export type SubcategoryValues = z.infer<typeof subcategorySchema>;

export const ICON_OPTIONS = [
	{ value: 'dumbbell', label: 'Sport' },
	{ value: 'book-open', label: 'Lecture' },
	{ value: 'music', label: 'Musique' },
	{ value: 'briefcase', label: 'Travail' },
	{ value: 'heart', label: 'Bien-etre' },
	{ value: 'code', label: 'Code' },
	{ value: 'palette', label: 'Art' },
	{ value: 'utensils', label: 'Cuisine' },
	{ value: 'graduation-cap', label: 'Etudes' },
	{ value: 'gamepad-2', label: 'Jeux' },
] as const;

export const COLOR_OPTIONS = [
	'#ef4444',
	'#f59e0b',
	'#10b981',
	'#3b82f6',
	'#a855f7',
	'#ec4899',
	'#f97316',
	'#06b6d4',
	'#84cc16',
	'#6366f1',
] as const;

export const MODULE_TYPES = [
	{ value: 'workout', label: 'Musculation' },
] as const;
