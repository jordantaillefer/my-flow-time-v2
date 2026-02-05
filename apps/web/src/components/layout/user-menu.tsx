import { useNavigate } from '@tanstack/react-router';
import { LogOut, User } from 'lucide-react';

import { authClient } from '@/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from '@/hooks/use-session';

export function UserMenu() {
	const { user } = useSession();
	const navigate = useNavigate();

	if (!user) return null;

	const initials = user.name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

	async function handleSignOut() {
		await authClient.signOut();
		navigate({ to: '/login' });
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-none">
				<Avatar className="h-8 w-8">
					<AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuLabel>
					<div className="flex flex-col">
						<span className="text-sm font-medium">{user.name}</span>
						<span className="text-muted-foreground text-xs">{user.email}</span>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem disabled>
					<User className="mr-2 h-4 w-4" />
					Profil
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut}>
					<LogOut className="mr-2 h-4 w-4" />
					Se deconnecter
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
