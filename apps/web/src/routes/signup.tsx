import { createFileRoute } from '@tanstack/react-router';

import { AuthPage } from '@/features/auth/auth-page';

export const Route = createFileRoute('/signup')({
	component: SignupPage,
});

function SignupPage() {
	return <AuthPage initialMode="signup" />;
}
