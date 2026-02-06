export const MUSCLE_GROUP_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
	pectoraux: { label: 'Pectoraux', emoji: '🫁', color: 'oklch(0.65 0.2 15)' },
	dos: { label: 'Dos', emoji: '🔙', color: 'oklch(0.65 0.2 250)' },
	epaules: { label: 'Epaules', emoji: '🏋️', color: 'oklch(0.7 0.18 45)' },
	biceps: { label: 'Biceps', emoji: '💪', color: 'oklch(0.65 0.2 145)' },
	triceps: { label: 'Triceps', emoji: '💪', color: 'oklch(0.65 0.18 175)' },
	abdominaux: { label: 'Abdominaux', emoji: '🎯', color: 'oklch(0.7 0.2 75)' },
	quadriceps: { label: 'Quadriceps', emoji: '🦵', color: 'oklch(0.65 0.2 300)' },
	fessiers: { label: 'Fessiers', emoji: '🍑', color: 'oklch(0.7 0.18 350)' },
	ischio_jambiers: { label: 'Ischio-jambiers', emoji: '🦵', color: 'oklch(0.6 0.18 210)' },
	mollets: { label: 'Mollets', emoji: '🦶', color: 'oklch(0.65 0.15 110)' },
};

export const MUSCLE_GROUPS = [
	'pectoraux',
	'dos',
	'epaules',
	'biceps',
	'triceps',
	'abdominaux',
	'quadriceps',
	'fessiers',
	'ischio_jambiers',
	'mollets',
] as const;
