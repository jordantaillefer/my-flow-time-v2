export const MUSCLE_GROUP_LABELS: Record<string, { label: string; emoji: string }> = {
	pectoraux: { label: 'Pectoraux', emoji: '🫁' },
	dos: { label: 'Dos', emoji: '🔙' },
	epaules: { label: 'Epaules', emoji: '🏋️' },
	biceps: { label: 'Biceps', emoji: '💪' },
	triceps: { label: 'Triceps', emoji: '💪' },
	abdominaux: { label: 'Abdominaux', emoji: '🎯' },
	quadriceps: { label: 'Quadriceps', emoji: '🦵' },
	fessiers: { label: 'Fessiers', emoji: '🍑' },
	ischio_jambiers: { label: 'Ischio-jambiers', emoji: '🦵' },
	mollets: { label: 'Mollets', emoji: '🦶' },
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
