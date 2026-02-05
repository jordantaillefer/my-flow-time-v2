import type { ReactNode } from 'react';

import { BottomNav } from './bottom-nav';
import { DesktopSidebar } from './desktop-sidebar';
import { Header } from './header';

interface AppShellProps {
	children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	return (
		<div className="bg-gradient-subtle flex min-h-screen">
			<DesktopSidebar />
			<div className="flex flex-1 flex-col">
				<Header />
				<main className="flex-1 px-4 py-4 pb-20 md:px-6 md:pb-4">{children}</main>
				<BottomNav />
			</div>
		</div>
	);
}
