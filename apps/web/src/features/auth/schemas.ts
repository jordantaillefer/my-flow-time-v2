import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Email invalide'),
	password: z.string().min(1, 'Mot de passe requis'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z
	.object({
		name: z.string().min(2, 'Le nom doit faire au moins 2 caracteres'),
		email: z.string().email('Email invalide'),
		password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caracteres'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Les mots de passe ne correspondent pas',
		path: ['confirmPassword'],
	});

export type SignupValues = z.infer<typeof signupSchema>;
