import { createRootRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

import { AppShell } from '@/components/layout/app-shell';
import { useSession } from '@/hooks/use-session';

const PUBLIC_ROUTES = ['/login', '/signup'];
const FULL_SCREEN_ROUTES = ['/session'];

export const Route = createRootRoute({
	component: RootLayout,
});

function RootLayout() {
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;
	const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);
	const isFullScreenRoute = FULL_SCREEN_ROUTES.some((r) => currentPath.startsWith(r));
	const { isAuthenticated, isLoading } = useSession();
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoading) return;

		if (!isAuthenticated && !isPublicRoute) {
			navigate({ to: '/login' });
		}

		if (isAuthenticated && isPublicRoute) {
			navigate({ to: '/' });
		}
	}, [isAuthenticated, isLoading, isPublicRoute, navigate]);

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="text-primary h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (isPublicRoute) {
		return (
			<>
				<Outlet />
				<TanStackRouterDevtools position="bottom-right" />
			</>
		);
	}

	if (!isAuthenticated) return null;

	if (isFullScreenRoute) {
		return (
			<>
				<Outlet />
				<TanStackRouterDevtools position="bottom-right" />
			</>
		);
	}

	return (
		<AppShell>
			<Outlet />
			<TanStackRouterDevtools position="bottom-right" />
		</AppShell>
	);
}
