import { cn } from '@/lib/utils';

import type { PlannedDayData } from '../calendar/types';
import { getSlotProgress, type SlotStatus } from './active-slot';

interface SlotCardProps {
	slot: PlannedDayData['slots'][number];
	status: SlotStatus;
	currentMinutes: number;
	onClick: () => void;
}

export function SlotCard({ slot, status, currentMinutes, onClick }: SlotCardProps) {
	const progress = status === 'active' ? getSlotProgress(slot, currentMinutes) : null;

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'relative flex w-full items-stretch gap-3 overflow-hidden rounded-xl border p-3 text-left transition-all',
				'bg-[oklch(0.26_0.04_275)]',
				status === 'past' && 'border-transparent bg-[oklch(0.22_0.03_275)]',
				status === 'active' && 'border-primary/50 bg-[oklch(0.30_0.05_275)] shadow-[0_0_16px_oklch(0.5_0.2_275/15%)]',
				status === 'upcoming' && 'hover:bg-[oklch(0.30_0.04_275)]',
			)}
		>
			{/* Barre couleur categorie */}
			<div className="w-1 shrink-0 rounded-full" style={{ backgroundColor: slot.subcategory.category.color }} />

			{/* Contenu */}
			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<div className="flex items-center gap-2">
					<span className="text-muted-foreground font-mono text-xs">
						{slot.startTime} - {slot.endTime}
					</span>
					{status === 'active' && <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />}
				</div>
				<span className="truncate text-sm font-medium">{slot.subcategory.name}</span>
				<span className="text-muted-foreground truncate text-xs">{slot.subcategory.category.name}</span>
			</div>

			{/* Barre de progression en bas pour le creneau actif */}
			{progress !== null && (
				<div className="bg-secondary absolute inset-x-0 bottom-0 h-0.5">
					<div className="bg-primary h-full transition-all duration-500" style={{ width: `${progress}%` }} />
				</div>
			)}
		</button>
	);
}
