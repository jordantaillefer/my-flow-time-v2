import { createFileRoute } from '@tanstack/react-router';
import { Timer } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignupForm } from '@/features/auth/signup-form';

export const Route = createFileRoute('/signup')({
	component: SignupPage,
});

function SignupPage() {
	return (
		<div className="bg-gradient-subtle flex min-h-screen items-center justify-center px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mb-2 flex items-center justify-center gap-2">
						<Timer className="text-primary h-6 w-6" />
						<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-xl font-bold text-transparent">My Flow Time</span>
					</div>
					<CardTitle>Inscription</CardTitle>
					<CardDescription>Cree ton compte pour commencer.</CardDescription>
				</CardHeader>
				<CardContent>
					<SignupForm />
				</CardContent>
			</Card>
		</div>
	);
}
