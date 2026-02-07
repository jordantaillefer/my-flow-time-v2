import { Link, useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, Github, Loader2, Timer } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formResolver } from '@/lib/form';
import { cn } from '@/lib/utils';

import { authClient } from '../../auth';
import { loginSchema, type LoginValues, signupSchema, type SignupValues } from './schemas';

type AuthMode = 'login' | 'signup';

export function AuthPage({ initialMode = 'login' }: { initialMode?: AuthMode }) {
	const [mode, setMode] = useState<AuthMode>(initialMode);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const loginForm = useForm<LoginValues>({
		resolver: formResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	const signupForm = useForm<SignupValues>({
		resolver: formResolver(signupSchema),
		defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
	});

	const form = mode === 'login' ? loginForm : signupForm;
	const isSubmitting = form.formState.isSubmitting;

	async function onLoginSubmit(values: LoginValues) {
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

	async function onSignupSubmit(values: SignupValues) {
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

	function switchMode(newMode: AuthMode) {
		setMode(newMode);
		setError(null);
		loginForm.reset();
		signupForm.reset();
	}

	return (
		<div className="relative flex min-h-screen">
			{/* Gradient mesh background */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-[oklch(0.35_0.15_280/15%)] blur-[120px]" />
				<div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-[oklch(0.4_0.18_300/12%)] blur-[100px]" />
				<div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.3_0.12_260/10%)] blur-[80px]" />
			</div>

			{/* Main content */}
			<div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
				{/* Logo */}
				<Link to="/" className="mb-8 flex items-center gap-2.5 transition-opacity hover:opacity-80">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
						<Timer className="h-5 w-5 text-white" />
					</div>
					<span className="text-xl font-semibold tracking-tight">My Flow Time</span>
				</Link>

				{/* Auth card */}
				<div className="w-full max-w-[400px]">
					{/* Card container */}
					<div className="rounded-2xl border border-white/[0.08] bg-[oklch(0.14_0.025_280/80%)] p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
						{/* Mode toggle */}
						<div className="mb-6 flex rounded-lg bg-white/[0.04] p-1">
							<button
								type="button"
								onClick={() => switchMode('login')}
								className={cn(
									'flex-1 rounded-md py-2 text-sm font-medium transition-all',
									mode === 'login' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/50 hover:text-white/70',
								)}
							>
								Connexion
							</button>
							<button
								type="button"
								onClick={() => switchMode('signup')}
								className={cn(
									'flex-1 rounded-md py-2 text-sm font-medium transition-all',
									mode === 'signup' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/50 hover:text-white/70',
								)}
							>
								Inscription
							</button>
						</div>

						{/* Social login */}
						<div className="mb-6 flex gap-3">
							<Button type="button" variant="outline" className="flex-1 border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06]" disabled>
								<Github className="h-4 w-4" />
								GitHub
							</Button>
							<Button type="button" variant="outline" className="flex-1 border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06]" disabled>
								<svg className="h-4 w-4" viewBox="0 0 24 24">
									<path
										fill="currentColor"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="currentColor"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="currentColor"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="currentColor"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Google
							</Button>
						</div>

						{/* Divider */}
						<div className="relative mb-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-white/[0.06]" />
							</div>
							<div className="relative flex justify-center text-xs">
								<span className="bg-[oklch(0.14_0.025_280)] px-3 text-white/40">ou continuer avec</span>
							</div>
						</div>

						{/* Error message */}
						{error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

						{/* Login form */}
						{mode === 'login' && (
							<Form {...loginForm}>
								<form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
									<FormField
										control={loginForm.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														type="email"
														placeholder="Email"
														className="h-11 border-white/[0.08] bg-white/[0.02] placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.04]"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={loginForm.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<div className="relative">
														<Input
															type={showPassword ? 'text' : 'password'}
															placeholder="Mot de passe"
															className="h-11 border-white/[0.08] bg-white/[0.02] pr-10 placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.04]"
															{...field}
														/>
														<button
															type="button"
															onClick={() => setShowPassword(!showPassword)}
															className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/60"
														>
															{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
														</button>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="flex items-center justify-end">
										<button type="button" className="text-xs text-white/40 transition-colors hover:text-white/60">
											Mot de passe oublie ?
										</button>
									</div>

									<Button
										type="submit"
										className="h-11 w-full bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:brightness-110 active:scale-[0.98]"
										disabled={isSubmitting}
									>
										{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Se connecter'}
									</Button>
								</form>
							</Form>
						)}

						{/* Signup form */}
						{mode === 'signup' && (
							<Form {...signupForm}>
								<form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
									<FormField
										control={signupForm.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														placeholder="Nom"
														className="h-11 border-white/[0.08] bg-white/[0.02] placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.04]"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={signupForm.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														type="email"
														placeholder="Email"
														className="h-11 border-white/[0.08] bg-white/[0.02] placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.04]"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={signupForm.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<div className="relative">
														<Input
															type={showPassword ? 'text' : 'password'}
															placeholder="Mot de passe"
															className="h-11 border-white/[0.08] bg-white/[0.02] pr-10 placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.04]"
															{...field}
														/>
														<button
															type="button"
															onClick={() => setShowPassword(!showPassword)}
															className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/60"
														>
															{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
														</button>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={signupForm.control}
										name="confirmPassword"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														type={showPassword ? 'text' : 'password'}
														placeholder="Confirmer le mot de passe"
														className="h-11 border-white/[0.08] bg-white/[0.02] placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.04]"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button
										type="submit"
										className="h-11 w-full bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:brightness-110 active:scale-[0.98]"
										disabled={isSubmitting}
									>
										{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Creer un compte'}
									</Button>
								</form>
							</Form>
						)}

						{/* Terms */}
						<p className="mt-6 text-center text-xs text-white/30">
							En continuant, tu acceptes nos{' '}
							<button type="button" className="text-white/50 underline-offset-2 hover:underline">
								Conditions d'utilisation
							</button>{' '}
							et notre{' '}
							<button type="button" className="text-white/50 underline-offset-2 hover:underline">
								Politique de confidentialite
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
