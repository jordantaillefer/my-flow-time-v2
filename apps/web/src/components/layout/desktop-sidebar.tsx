import { Link, useRouterState } from '@tanstack/react-router';
import { Timer } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { navItems } from './nav-items';
import { UserMenu } from './user-menu';

export function DesktopSidebar() {
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	return (
		<aside className="bg-gradient-sidebar text-sidebar-foreground border-sidebar-border sticky top-0 hidden h-screen w-64 flex-col border-r md:flex">
			<div className="flex items-center gap-2 px-6 py-5">
				<Timer className="text-primary h-6 w-6" />
				<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-lg font-semibold text-transparent">My Flow Time</span>
			</div>
			<Separator />
			<nav className="flex flex-1 flex-col gap-1 p-3">
				{navItems.map((item) => {
					const isActive = currentPath === item.href;
					const Icon = item.icon;

					return (
						<Link
							key={item.href}
							to={item.href}
							className={cn(
								'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
								isActive
									? 'bg-gradient-primary text-primary-foreground shadow-glow font-medium'
									: 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
							)}
						>
							<Icon className="h-5 w-5" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>
			<Separator />
			<div className="flex items-center justify-between px-4 py-3">
				<UserMenu />
			</div>
		</aside>
	);
}
