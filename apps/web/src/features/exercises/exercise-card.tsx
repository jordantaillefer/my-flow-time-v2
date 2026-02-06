import { useState } from 'react';

import { Badge } from '@/components/ui/badge';

import { MUSCLE_GROUP_LABELS } from './muscle-group-labels';

export interface ExerciseData {
	id: string;
	name: string;
	muscleGroup: string;
	description: string;
	imageUrl: string | null;
}

interface ExerciseCardProps {
	exercise: ExerciseData;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
	const group = MUSCLE_GROUP_LABELS[exercise.muscleGroup];
	const [imgError, setImgError] = useState(false);

	return (
		<div className="bg-[oklch(0.26_0.04_275)] flex flex-col overflow-hidden rounded-xl border">
			{exercise.imageUrl && !imgError && (
				<div className="bg-[oklch(0.2_0.02_275)] relative aspect-[16/10] w-full overflow-hidden">
					<img
						src={exercise.imageUrl}
						alt={exercise.name}
						loading="lazy"
						onError={() => setImgError(true)}
						className="h-full w-full object-cover"
					/>
				</div>
			)}
			<div className="flex flex-col gap-2 p-4">
				<div className="flex items-start justify-between gap-2">
					<h3 className="text-sm font-semibold">{exercise.name}</h3>
					{group && (
						<Badge variant="secondary" className="shrink-0 text-[10px]">
							{group.label}
						</Badge>
					)}
				</div>
				{exercise.description && (
					<p className="text-muted-foreground text-xs leading-relaxed">{exercise.description}</p>
				)}
			</div>
		</div>
	);
}
