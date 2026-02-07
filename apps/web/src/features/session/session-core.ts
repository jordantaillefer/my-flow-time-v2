interface PlanExercise {
	id: string;
	plannedSets: number;
}

interface LoggedSet {
	workoutPlanExerciseId: string;
}

export interface SessionSummary {
	duration: string;
	totalSets: number;
	totalReps: number;
	totalVolume: number;
	averageFeeling: number;
	exerciseCount: number;
}

export function getSessionProgress(exercises: PlanExercise[], loggedSets: LoggedSet[]) {
	const total = exercises.reduce((sum, e) => sum + e.plannedSets, 0);
	const done = loggedSets.length;
	const percent = total === 0 ? 0 : Math.min(Math.round((done / total) * 100), 100);
	return { done, total, percent };
}

export function getSetsForExercise(loggedSets: LoggedSet[], workoutPlanExerciseId: string) {
	return loggedSets.filter((s) => s.workoutPlanExerciseId === workoutPlanExerciseId);
}

export function getNextSetNumber(loggedSets: LoggedSet[], workoutPlanExerciseId: string): number {
	return getSetsForExercise(loggedSets, workoutPlanExerciseId).length + 1;
}

export function isExerciseComplete(exercise: PlanExercise, loggedSets: LoggedSet[]): boolean {
	return getSetsForExercise(loggedSets, exercise.id).length >= exercise.plannedSets;
}

export function findFirstIncompleteExerciseIndex(exercises: PlanExercise[], loggedSets: LoggedSet[]): number {
	const idx = exercises.findIndex((e) => !isExerciseComplete(e, loggedSets));
	return idx === -1 ? 0 : idx;
}

export function isSessionFullyComplete(exercises: PlanExercise[], loggedSets: LoggedSet[]): boolean {
	return exercises.every((e) => isExerciseComplete(e, loggedSets));
}

export function getRestTimerDisplay(remainingSeconds: number): string {
	const mins = Math.floor(remainingSeconds / 60);
	const secs = remainingSeconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getSessionDuration(startedAt: Date | string): { minutes: number; display: string } {
	const start = startedAt instanceof Date ? startedAt : new Date(startedAt);
	const ms = Date.now() - start.getTime();
	const minutes = Math.floor(ms / 60000);
	if (minutes < 60) {
		return { minutes, display: `${minutes} min` };
	}
	const hours = Math.floor(minutes / 60);
	const remainingMins = minutes % 60;
	return { minutes, display: remainingMins > 0 ? `${hours}h${remainingMins.toString().padStart(2, '0')}` : `${hours}h` };
}

export interface WeightDiff {
	workoutPlanExerciseId: string;
	exerciseName: string;
	plannedWeight: number;
	usedWeights: number[];
}

export function getWeightDiffs(
	exercises: Array<{ id: string; plannedWeight: number; exercise: { name: string } }>,
	loggedSets: Array<{ workoutPlanExerciseId: string; weight: number }>,
): WeightDiff[] {
	const diffs: WeightDiff[] = [];
	for (const ex of exercises) {
		const sets = loggedSets.filter((s) => s.workoutPlanExerciseId === ex.id);
		if (sets.length === 0) continue;

		const distinctWeights = [...new Set(sets.map((s) => s.weight))].sort((a, b) => a - b);
		const hasNewWeight = distinctWeights.some((w) => w !== ex.plannedWeight);

		if (hasNewWeight) {
			diffs.push({
				workoutPlanExerciseId: ex.id,
				exerciseName: ex.exercise.name,
				plannedWeight: ex.plannedWeight,
				usedWeights: distinctWeights.filter((w) => w !== ex.plannedWeight),
			});
		}
	}
	return diffs;
}

export function computeSessionSummary(
	loggedSets: Array<{ reps: number; weight: number; feeling: number }>,
	startedAt: Date | string,
	exerciseCount: number,
): SessionSummary {
	const { display: duration } = getSessionDuration(startedAt);
	const totalSets = loggedSets.length;
	const totalReps = loggedSets.reduce((sum, s) => sum + s.reps, 0);
	const totalVolume = loggedSets.reduce((sum, s) => sum + s.reps * s.weight, 0);
	const averageFeeling = totalSets > 0 ? Math.round((loggedSets.reduce((sum, s) => sum + s.feeling, 0) / totalSets) * 10) / 10 : 0;

	return { duration, totalSets, totalReps, totalVolume, averageFeeling, exerciseCount };
}
