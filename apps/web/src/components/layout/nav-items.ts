import { Calendar, Dumbbell, LayoutDashboard, Settings } from 'lucide-react';

export const navItems = [
	{ label: "Aujourd'hui", href: '/', icon: LayoutDashboard },
	{ label: 'Calendrier', href: '/calendar', icon: Calendar },
	{ label: 'Exercices', href: '/exercises', icon: Dumbbell },
	{ label: 'Parametres', href: '/settings', icon: Settings },
] as const;
