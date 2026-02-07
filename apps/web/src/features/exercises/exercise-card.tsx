import { useState } from 'react';

import { Badge } from '@/components/ui/badge';

import { EQUIPMENT_LABELS } from './equipment-labels';
import { MUSCLE_GROUP_LABELS } from './muscle-group-labels';

export interface ExerciseData {
	id: string;
	name: string;
	muscleGroup: string;
	equipment: string;
	description: string;
	imageUrl: string | null;
}

interface ExerciseCardProps {
	exercise: ExerciseData;
	onSelect: (exercise: ExerciseData) => void;
}

export function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
	const group = MUSCLE_GROUP_LABELS[exercise.muscleGroup];
	const equip = EQUIPMENT_LABELS[exercise.equipment];
	const [imgError, setImgError] = useState(false);

	const initials = exercise.name
		.split(' ')
		.slice(0, 2)
		.map((w) => w[0])
		.join('')
		.toUpperCase();

	return (
		<button
			type="button"
			onClick={() => onSelect(exercise)}
			className="group bg-card flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20"
		>
			<div className="relative aspect-[16/10] w-full overflow-hidden">
				{exercise.imageUrl && !imgError ? (
					<img
						src={exercise.imageUrl}
						alt={exercise.name}
						loading="lazy"
						onError={() => setImgError(true)}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<div
						className="flex h-full w-full items-center justify-center text-2xl font-bold text-white/60"
						style={{ backgroundColor: group?.color ?? 'oklch(0.35 0.05 275)' }}
					>
						{initials}
					</div>
				)}
				{/* Gradient overlay with name */}
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-8">
					<h3 className="text-sm font-semibold leading-tight text-white drop-shadow-sm">{exercise.name}</h3>
				</div>
			</div>
			<div className="flex flex-wrap gap-1.5 px-3 py-2.5">
				{group && (
					<Badge
						variant="secondary"
						className="text-[10px]"
						style={{
							backgroundColor: `color-mix(in oklch, ${group.color} 25%, transparent)`,
							color: group.color,
							borderColor: `color-mix(in oklch, ${group.color} 40%, transparent)`,
						}}
					>
						{group.label}
					</Badge>
				)}
				{equip && (
					<Badge variant="outline" className="text-[10px]">
						{equip.label}
					</Badge>
				)}
			</div>
		</button>
	);
}
