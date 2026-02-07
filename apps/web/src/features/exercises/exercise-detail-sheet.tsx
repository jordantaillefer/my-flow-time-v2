import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { EQUIPMENT_LABELS } from './equipment-labels';
import type { ExerciseData } from './exercise-card';
import { MUSCLE_GROUP_LABELS } from './muscle-group-labels';

interface ExerciseDetailSheetProps {
	exercise: ExerciseData | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ExerciseDetailSheet({ exercise, open, onOpenChange }: ExerciseDetailSheetProps) {
	const [imgError, setImgError] = useState(false);

	if (!exercise) return null;

	const group = MUSCLE_GROUP_LABELS[exercise.muscleGroup];
	const equip = EQUIPMENT_LABELS[exercise.equipment];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md overflow-hidden p-0">
				{/* Image */}
				{exercise.imageUrl && !imgError ? (
					<div className="relative aspect-[16/10] w-full overflow-hidden">
						<img src={exercise.imageUrl} alt={exercise.name} onError={() => setImgError(true)} className="h-full w-full object-cover" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
					</div>
				) : (
					<div
						className="flex aspect-[16/10] w-full items-center justify-center text-4xl font-bold text-white/40"
						style={{ backgroundColor: group?.color ?? 'oklch(0.35 0.05 275)' }}
					>
						{exercise.name
							.split(' ')
							.slice(0, 2)
							.map((w) => w[0])
							.join('')
							.toUpperCase()}
					</div>
				)}

				<DialogHeader className="px-5 pt-0 pb-5">
					<DialogTitle>{exercise.name}</DialogTitle>
					<div className="flex flex-wrap gap-2 pt-1">
						{group && (
							<Badge
								variant="secondary"
								className="text-xs"
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
							<Badge variant="outline" className="text-xs">
								{equip.label}
							</Badge>
						)}
					</div>
					{exercise.description && <DialogDescription className="pt-2 leading-relaxed">{exercise.description}</DialogDescription>}
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
