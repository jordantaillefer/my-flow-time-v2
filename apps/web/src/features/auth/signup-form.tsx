import { Link, useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formResolver } from '@/lib/form';

import { authClient } from '../../auth';
import { signupSchema, type SignupValues } from './schemas';

export function SignupForm() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	const form = useForm<SignupValues>({
		resolver: formResolver(signupSchema),
		defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
	});

	async function onSubmit(values: SignupValues) {
		setError(null);
		const result = await authClient.signUp.email({
			name: values.name,
			email: values.email,
			password: values.password,
		});

		if (result.error) {
			setError(result.error.message ?? "Erreur lors de l'inscription");
			return;
		}

		navigate({ to: '/' });
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{error && <p className="text-destructive text-sm">{error}</p>}
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nom</FormLabel>
							<FormControl>
								<Input placeholder="Jordan" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="nom@exemple.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mot de passe</FormLabel>
							<FormControl>
								<Input type="password" placeholder="••••••••" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirmer le mot de passe</FormLabel>
							<FormControl>
								<Input type="password" placeholder="••••••••" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					S'inscrire
				</Button>
				<p className="text-muted-foreground text-center text-sm">
					Deja un compte ?{' '}
					<Link to="/login" className="text-primary underline-offset-4 hover:underline">
						Se connecter
					</Link>
				</p>
			</form>
		</Form>
	);
}
