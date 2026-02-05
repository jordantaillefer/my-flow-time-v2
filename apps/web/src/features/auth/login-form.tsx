import { Link, useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formResolver } from '@/lib/form';

import { authClient } from '../../auth';
import { loginSchema, type LoginValues } from './schemas';

export function LoginForm() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	const form = useForm<LoginValues>({
		resolver: formResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	async function onSubmit(values: LoginValues) {
		setError(null);
		const result = await authClient.signIn.email({
			email: values.email,
			password: values.password,
		});

		if (result.error) {
			setError(result.error.message ?? 'Erreur de connexion');
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
				<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Se connecter
				</Button>
				<p className="text-muted-foreground text-center text-sm">
					Pas encore de compte ?{' '}
					<Link to="/signup" className="text-primary underline-offset-4 hover:underline">
						S'inscrire
					</Link>
				</p>
			</form>
		</Form>
	);
}
