import { BarChart3, Calendar, ClipboardList, Dumbbell, LayoutDashboard, Settings } from 'lucide-react';

export const navItems = [
	{ label: "Aujourd'hui", href: '/', icon: LayoutDashboard },
	{ label: 'Calendrier', href: '/calendar', icon: Calendar },
	{ label: 'Exercices', href: '/exercises', icon: Dumbbell },
	{ label: 'Seances', href: '/workouts', icon: ClipboardList },
	{ label: 'Historique', href: '/history', icon: BarChart3 },
	{ label: 'Parametres', href: '/settings', icon: Settings },
] as const;
