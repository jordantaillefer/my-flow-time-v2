export const EQUIPMENT_LABELS: Record<string, { label: string; icon: string }> = {
	barre: { label: 'Barre', icon: 'Barbell' },
	halteres: { label: 'Halteres', icon: 'Dumbbell' },
	machine: { label: 'Machine', icon: 'Cog' },
	poulie: { label: 'Poulie', icon: 'Cable' },
	elastique: { label: 'Elastique', icon: 'Zap' },
	kettlebell: { label: 'Kettlebell', icon: 'CircleDot' },
	poids_du_corps: { label: 'Poids du corps', icon: 'User' },
	sangles: { label: 'Sangles', icon: 'Link' },
	swiss_ball: { label: 'Swiss Ball', icon: 'Circle' },
	landmine: { label: 'Landmine', icon: 'Anchor' },
};

export const EQUIPMENTS = [
	'barre',
	'halteres',
	'machine',
	'poulie',
	'poids_du_corps',
	'elastique',
	'kettlebell',
	'sangles',
	'swiss_ball',
	'landmine',
] as const;
