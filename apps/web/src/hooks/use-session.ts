import { authClient } from '@/auth';

export function useSession() {
	const session = authClient.useSession();

	return {
		user: session.data?.user ?? null,
		isLoading: session.isPending,
		isAuthenticated: !!session.data?.user,
	};
}
