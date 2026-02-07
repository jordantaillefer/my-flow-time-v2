import { CheckCircle2, Dumbbell } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';

import { LoggedSetRow } from './logged-set-row';
import type { LogSetValues } from './schemas';
import { getNextSetNumber, getSetsForExercise, isExerciseComplete } from './session-core';
import { SetLogForm } from './set-log-form';

interface ExerciseInfo {
	id: string;
	name: string;
	muscleGroup: string;
	imageUrl?: string | null;
}

interface PlanExercise {
	id: string;
	plannedSets: number;
	plannedReps: number;
	plannedWeight: number;
	plannedRestSeconds: number;
	exercise: ExerciseInfo;
}

interface LoggedSet {
	id: string;
	setNumber: number;
	reps: number;
	weight: number;
	feeling: number;
	workoutPlanExerciseId: string;
}

interface ExerciseViewProps {
	planExercise: PlanExercise;
	loggedSets: LoggedSet[];
	onLogSet: (values: LogSetValues) => void;
	onEditSet: (setId: string, values: LogSetValues) => void;
	onDeleteSet: (setId: string) => void;
	isLogging: boolean;
}

export function ExerciseView({ planExercise, loggedSets, onLogSet, onEditSet, onDeleteSet, isLogging }: ExerciseViewProps) {
	const exerciseSets = getSetsForExercise(loggedSets, planExercise.id) as LoggedSet[];
	const nextSetNumber = getNextSetNumber(loggedSets, planExercise.id);
	const complete = isExerciseComplete(planExercise, loggedSets);
	const [editingSetId, setEditingSetId] = useState<string | null>(null);

	const { exercise } = planExercise;

	return (
		<div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
			{/* Exercise info */}
			<div className="flex items-center gap-3">
				{exercise.imageUrl ? (
					<img src={exercise.imageUrl} alt={exercise.name} className="h-14 w-14 rounded-lg object-cover" />
				) : (
					<div className="bg-muted flex h-14 w-14 items-center justify-center rounded-lg">
						<Dumbbell className="text-muted-foreground h-6 w-6" />
					</div>
				)}
				<div className="flex-1">
					<h2 className="text-lg font-bold">{exercise.name}</h2>
					<p className="text-muted-foreground text-sm capitalize">{exercise.muscleGroup.replace('_', ' ')}</p>
				</div>
				{complete && (
					<Badge variant="default" className="gap-1">
						<CheckCircle2 className="h-3 w-3" />
						Complet
					</Badge>
				)}
			</div>

			{/* Objectif */}
			<div className="bg-muted/50 rounded-md px-3 py-2 text-sm">
				<span className="text-muted-foreground">Objectif : </span>
				<span className="font-medium">
					{planExercise.plannedSets} x {planExercise.plannedReps}
					{planExercise.plannedWeight > 0 && ` @ ${planExercise.plannedWeight} kg`}
				</span>
				<span className="text-muted-foreground"> / Repos : {planExercise.plannedRestSeconds}s</span>
			</div>

			{/* Logged sets */}
			{exerciseSets.length > 0 && (
				<div className="space-y-2">
					<h3 className="text-sm font-semibold">Series completees</h3>
					{exerciseSets.map((set) =>
						editingSetId === set.id ? (
							<SetLogForm
								key={set.id}
								defaultValues={{ reps: set.reps, weight: set.weight, feeling: set.feeling }}
								onSubmit={(values) => {
									onEditSet(set.id, values);
									setEditingSetId(null);
								}}
								isSubmitting={isLogging}
							/>
						) : (
							<LoggedSetRow
								key={set.id}
								setNumber={set.setNumber}
								reps={set.reps}
								weight={set.weight}
								feeling={set.feeling}
								onEdit={() => setEditingSetId(set.id)}
								onDelete={() => onDeleteSet(set.id)}
							/>
						),
					)}
				</div>
			)}

			{/* New set form */}
			{!complete && (
				<div className="space-y-2">
					<h3 className="text-sm font-semibold">
						Serie {nextSetNumber} / {planExercise.plannedSets}
					</h3>
					<SetLogForm
						key={`new-${nextSetNumber}`}
						defaultValues={{
							reps: planExercise.plannedReps,
							weight: planExercise.plannedWeight,
							feeling: 3,
						}}
						onSubmit={onLogSet}
						isSubmitting={isLogging}
					/>
				</div>
			)}
		</div>
	);
}
