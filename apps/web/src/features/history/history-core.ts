const FEELING_EMOJIS = ['', '😫', '😓', '😐', '💪', '🔥'] as const;

export function formatSessionDate(startedAt: string): string {
	const date = new Date(startedAt);
	const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
	const months = ['jan', 'fev', 'mar', 'avr', 'mai', 'jun', 'jul', 'aou', 'sep', 'oct', 'nov', 'dec'];
	return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatSessionDuration(startedAt: string, completedAt: string): string {
	const start = new Date(startedAt);
	const end = new Date(completedAt);
	const minutes = Math.floor((end.getTime() - start.getTime()) / 60000);
	if (minutes < 60) {
		return `${minutes} min`;
	}
	const hours = Math.floor(minutes / 60);
	const remainingMins = minutes % 60;
	return remainingMins > 0 ? `${hours}h${remainingMins.toString().padStart(2, '0')}` : `${hours}h`;
}

export interface SessionStats {
	totalSets: number;
	totalReps: number;
	totalVolume: number;
	avgFeeling: number;
}

export function computeSessionStats(sets: Array<{ reps: number; weight: number; feeling: number }>): SessionStats {
	const totalSets = sets.length;
	const totalReps = sets.reduce((sum, s) => sum + s.reps, 0);
	const totalVolume = sets.reduce((sum, s) => sum + s.reps * s.weight, 0);
	const avgFeeling = totalSets > 0 ? Math.round((sets.reduce((sum, s) => sum + s.feeling, 0) / totalSets) * 10) / 10 : 0;
	return { totalSets, totalReps, totalVolume, avgFeeling };
}

export interface GroupedExercise {
	exerciseId: string;
	exerciseName: string;
	sets: Array<{ setNumber: number; reps: number; weight: number; feeling: number }>;
}

export function groupSetsByExercise(
	sets: Array<{ exerciseId: string; setNumber: number; reps: number; weight: number; feeling: number; exercise?: { name: string } }>,
): GroupedExercise[] {
	const map = new Map<string, GroupedExercise>();
	for (const set of sets) {
		const existing = map.get(set.exerciseId);
		if (existing) {
			existing.sets.push({ setNumber: set.setNumber, reps: set.reps, weight: set.weight, feeling: set.feeling });
		} else {
			map.set(set.exerciseId, {
				exerciseId: set.exerciseId,
				exerciseName: set.exercise?.name ?? 'Exercice inconnu',
				sets: [{ setNumber: set.setNumber, reps: set.reps, weight: set.weight, feeling: set.feeling }],
			});
		}
	}
	return [...map.values()];
}

export function formatChartDate(dateStr: string): string {
	const date = new Date(dateStr);
	return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

export function getFeelingEmoji(feeling: number): string {
	return FEELING_EMOJIS[Math.round(feeling)] ?? '';
}
