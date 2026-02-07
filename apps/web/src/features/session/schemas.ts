import { z } from 'zod';

export const logSetSchema = z.object({
	reps: z.coerce.number().int().min(0),
	weight: z.coerce.number().min(0),
	feeling: z.coerce.number().int().min(1).max(5),
});

export type LogSetValues = z.infer<typeof logSetSchema>;

export const completeSessionSchema = z.object({
	notes: z.string().optional(),
});

export type CompleteSessionValues = z.infer<typeof completeSessionSchema>;
