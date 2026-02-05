import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { slotStyle } from '@/lib/calendar';
import { trpc } from '@/lib/trpc';

import { PlannedSlotFormDialog } from './planned-slot-form-dialog';
import type { PlannedSlotValues } from './schemas';
import type { PlannedDayData } from './types';

type Slot = PlannedDayData['slots'][number];

interface TimeSlotBlockProps {
	slot: Slot;
}

export function TimeSlotBlock({ slot }: TimeSlotBlockProps) {
	const utils = trpc.useUtils();

	const updateSlot = trpc.plannedSlot.update.useMutation({
		onSuccess: () => utils.plannedDay.getRange.invalidate(),
	});
	const deleteSlot = trpc.plannedSlot.delete.useMutation({
		onSuccess: () => utils.plannedDay.getRange.invalidate(),
	});

	const { top, height } = slotStyle(slot.startTime, slot.endTime);
	const isCompact = height < 40;

	return (
		<div
			className="group absolute inset-x-0.5 overflow-hidden rounded-md border text-xs"
			style={{
				top,
				height,
				borderLeftWidth: 3,
				borderLeftColor: slot.subcategory.category.color,
				backgroundColor: slot.subcategory.category.color + '10',
			}}
		>
			<div className="flex h-full items-start justify-between gap-1 px-1.5 py-0.5">
				<div className="min-w-0 flex-1">
					{isCompact ? (
						<span className="truncate font-mono">
							{slot.startTime}-{slot.endTime} {slot.subcategory.name}
						</span>
					) : (
						<>
							<span className="font-mono">
								{slot.startTime} - {slot.endTime}
							</span>
							<p className="text-muted-foreground truncate">{slot.subcategory.name}</p>
						</>
					)}
				</div>
				<div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
					<PlannedSlotFormDialog
						title="Modifier le creneau"
						defaultValues={{
							startTime: slot.startTime,
							endTime: slot.endTime,
							subcategoryId: slot.subcategoryId,
						}}
						trigger={
							<Button variant="ghost" size="icon" className="h-5 w-5">
								<Pencil className="h-3 w-3" />
							</Button>
						}
						onSubmit={async (values: PlannedSlotValues) => {
							await updateSlot.mutateAsync({
								id: slot.id,
								order: slot.order,
								...values,
							});
						}}
					/>
					<Button
						variant="ghost"
						size="icon"
						className="text-destructive h-5 w-5"
						onClick={() => deleteSlot.mutate({ id: slot.id })}
					>
						<Trash2 className="h-3 w-3" />
					</Button>
				</div>
			</div>
		</div>
	);
}
