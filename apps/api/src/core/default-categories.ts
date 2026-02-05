export const DEFAULT_CATEGORIES = [
	{
		name: 'Sport',
		icon: 'dumbbell',
		color: '#ef4444',
		subcategories: [
			{ name: 'Musculation', moduleType: 'workout' },
			{ name: 'Cardio', moduleType: null },
			{ name: 'Stretching', moduleType: null },
		],
	},
	{
		name: 'Lecture',
		icon: 'book-open',
		color: '#3b82f6',
		subcategories: [{ name: 'Livre', moduleType: null }],
	},
	{
		name: 'Musique',
		icon: 'music',
		color: '#a855f7',
		subcategories: [
			{ name: 'Pratique instrument', moduleType: null },
			{ name: 'Composition', moduleType: null },
		],
	},
	{
		name: 'Travail',
		icon: 'briefcase',
		color: '#f59e0b',
		subcategories: [
			{ name: 'Deep work', moduleType: null },
			{ name: 'Reunions', moduleType: null },
		],
	},
	{
		name: 'Bien-etre',
		icon: 'heart',
		color: '#10b981',
		subcategories: [
			{ name: 'Meditation', moduleType: null },
			{ name: 'Repos', moduleType: null },
		],
	},
] as const;
