import { Timer } from 'lucide-react';

import { UserMenu } from './user-menu';

export function Header() {
	return (
		<header className="bg-gradient-header border-border sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 md:hidden">
			<div className="flex items-center gap-2">
				<Timer className="text-primary h-5 w-5" />
				<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-lg font-semibold text-transparent">
					My Flow Time
				</span>
			</div>
			<UserMenu />
		</header>
	);
}
