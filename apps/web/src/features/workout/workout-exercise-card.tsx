import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MUSCLE_GROUP_LABELS } from '@/features/exercises/muscle-group-labels';

import { WorkoutExerciseFormDialog, type WorkoutExerciseValues } from './workout-exercise-form-dialog';

export interface WorkoutExerciseData {
	id: string;
	order: number;
	plannedSets: number;
	plannedReps: number;
	plannedWeight: number;
	plannedRestSeconds: number;
	exercise: {
		id: string;
		name: string;
		muscleGroup: string;
		imageUrl: string | null;
	};
}

interface WorkoutExerciseCardProps {
	item: WorkoutExerciseData;
	onUpdate: (values: WorkoutExerciseValues) => Promise<void>;
	onDelete: () => void;
}

export function WorkoutExerciseCard({ item, onUpdate, onDelete }: WorkoutExerciseCardProps) {
	const [editOpen, setEditOpen] = useState(false);
	const [imgError, setImgError] = useState(false);
	const group = MUSCLE_GROUP_LABELS[item.exercise.muscleGroup];

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: item.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const initials = item.exercise.name
		.split(' ')
		.slice(0, 2)
		.map((w) => w[0])
		.join('')
		.toUpperCase();

	return (
		<>
			<Card
				ref={setNodeRef}
				style={style}
				className={isDragging ? 'z-50 opacity-50' : ''}
			>
				<CardContent className="flex items-center gap-3 py-3">
					<button
						type="button"
						className="text-muted-foreground hover:text-foreground shrink-0 cursor-grab touch-none"
						{...attributes}
						{...listeners}
					>
						<GripVertical className="h-5 w-5" />
					</button>

					{/* Thumbnail */}
					<div className="h-10 w-10 shrink-0 overflow-hidden rounded">
						{item.exercise.imageUrl && !imgError ? (
							<img
								src={item.exercise.imageUrl}
								alt={item.exercise.name}
								loading="lazy"
								onError={() => setImgError(true)}
								className="h-full w-full object-cover"
							/>
						) : (
							<div
								className="flex h-full w-full items-center justify-center text-[10px] font-bold text-white/60"
								style={{ backgroundColor: group?.color ?? 'oklch(0.35 0.05 275)' }}
							>
								{initials}
							</div>
						)}
					</div>

					{/* Info */}
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium">{item.exercise.name}</p>
						<p className="text-muted-foreground text-xs">
							{item.plannedSets} x {item.plannedReps}
							{item.plannedWeight > 0 && ` @ ${item.plannedWeight}kg`}
							{' · '}
							{item.plannedRestSeconds}s repos
						</p>
					</div>

					{/* Actions */}
					<div className="flex shrink-0 items-center gap-1">
						<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditOpen(true)}>
							<Pencil className="h-3.5 w-3.5" />
						</Button>
						<Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={onDelete}>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</div>
				</CardContent>
			</Card>

			<WorkoutExerciseFormDialog
				exerciseName={item.exercise.name}
				defaultValues={{
					plannedSets: item.plannedSets,
					plannedReps: item.plannedReps,
					plannedWeight: item.plannedWeight,
					plannedRestSeconds: item.plannedRestSeconds,
				}}
				open={editOpen}
				onOpenChange={setEditOpen}
				onSubmit={onUpdate}
			/>
		</>
	);
}
