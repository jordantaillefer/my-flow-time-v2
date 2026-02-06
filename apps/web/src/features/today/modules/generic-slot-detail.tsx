import { Badge } from '@/components/ui/badge';

import { getSlotProgress, getSlotStatus } from '../active-slot';
import type { ModuleProps } from './module-registry';

export function GenericSlotDetail({ slot, currentMinutes }: ModuleProps) {
	const status = getSlotStatus(slot, currentMinutes);
	const progress = status === 'active' ? getSlotProgress(slot, currentMinutes) : null;

	return (
		<div className="flex flex-col gap-4">
			{/* Horaires */}
			<div className="flex items-center gap-2">
				<span className="font-mono text-lg font-semibold">
					{slot.startTime} — {slot.endTime}
				</span>
				{status === 'active' && (
					<Badge variant="default" className="animate-pulse">
						En cours
					</Badge>
				)}
				{status === 'past' && <Badge variant="secondary">Termine</Badge>}
			</div>

			{/* Categorie / Sous-categorie */}
			<div className="flex items-center gap-2">
				<span
					className="inline-block h-3 w-3 rounded-full"
					style={{ backgroundColor: slot.subcategory.category.color }}
				/>
				<span className="text-muted-foreground text-sm">{slot.subcategory.category.name}</span>
				<span className="text-muted-foreground text-sm">/</span>
				<span className="text-sm font-medium">{slot.subcategory.name}</span>
			</div>

			{/* Barre de progression */}
			{progress !== null && (
				<div className="flex flex-col gap-1">
					<div className="flex justify-between text-xs">
						<span className="text-muted-foreground">Progression</span>
						<span className="font-mono font-medium">{Math.round(progress)}%</span>
					</div>
					<div className="bg-secondary h-2 overflow-hidden rounded-full">
						<div
							className="bg-primary h-full rounded-full transition-all duration-500"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
