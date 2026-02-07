import { Calendar, ClipboardList, Dumbbell, LayoutDashboard, Settings } from 'lucide-react';

export const navItems = [
	{ label: "Aujourd'hui", href: '/', icon: LayoutDashboard },
	{ label: 'Calendrier', href: '/calendar', icon: Calendar },
	{ label: 'Exercices', href: '/exercises', icon: Dumbbell },
	{ label: 'Seances', href: '/workouts', icon: ClipboardList },
	{ label: 'Parametres', href: '/settings', icon: Settings },
] as const;
