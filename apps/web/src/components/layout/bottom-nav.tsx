import { Link, useRouterState } from '@tanstack/react-router';

import { cn } from '@/lib/utils';

import { navItems } from './nav-items';

export function BottomNav() {
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	return (
		<nav className="bg-gradient-header border-border fixed bottom-0 left-0 right-0 z-50 border-t md:hidden">
			<div className="flex items-center justify-around">
				{navItems.map((item) => {
					const isActive = currentPath === item.href;
					const Icon = item.icon;

					return (
						<Link
							key={item.href}
							to={item.href}
							className={cn(
								'flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors',
								isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
							)}
						>
							<Icon className="h-5 w-5" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
