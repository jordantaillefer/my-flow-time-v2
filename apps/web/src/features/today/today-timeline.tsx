import { Loader2 } from 'lucide-react';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { trpc } from '@/lib/trpc';

import type { PlannedDayData } from '../calendar/types';
import { findActiveSlotIndex, getSlotStatus } from './active-slot';
import { GenericSlotDetail } from './modules/generic-slot-detail';
import { getModuleComponent } from './modules/module-registry';
import { SlotCard } from './slot-card';
import { useCurrentMinutes } from './use-current-minutes';

export function TodayTimeline() {
	const today = DateTime.now().toISODate()!;
	const currentMinutes = useCurrentMinutes();
	const listRef = useRef<HTMLDivElement>(null);
	const activeCardRef = useRef<HTMLDivElement>(null);

	const [selectedSlot, setSelectedSlot] = useState<PlannedDayData['slots'][number] | null>(null);

	const daysQuery = trpc.plannedDay.getRange.useQuery({
		startDate: today,
		endDate: today,
	});

	const slots = daysQuery.data?.[0]?.slots ?? [];
	const activeIndex = findActiveSlotIndex(slots, currentMinutes);

	// Auto-scroll vers le creneau actif au mount
	useEffect(() => {
		if (activeCardRef.current) {
			activeCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, [daysQuery.data]);  

	if (daysQuery.isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
			</div>
		);
	}

	if (slots.length === 0) {
		return (
			<div className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-center">
				<p className="text-sm">Aucun creneau planifie</p>
			</div>
		);
	}

	// Resolve the detail component for the selected slot
	const DetailComponent = selectedSlot
		? getModuleComponent(selectedSlot.subcategory.moduleType) ?? GenericSlotDetail
		: null;

	return (
		<>
			<div ref={listRef} className="flex flex-col gap-2">
				{slots.map((slot, index) => {
					const status = getSlotStatus(slot, currentMinutes);
					const isActive = index === activeIndex;

					return (
						<div key={slot.id} ref={isActive ? activeCardRef : undefined}>
							<SlotCard
								slot={slot}
								status={status}
								currentMinutes={currentMinutes}
								onClick={() => setSelectedSlot(slot)}
							/>
						</div>
					);
				})}
			</div>

			<Sheet open={selectedSlot !== null} onOpenChange={(open) => { if (!open) setSelectedSlot(null); }}>
				<SheetContent side="bottom" className="max-h-[70vh]">
					<SheetHeader>
						<SheetTitle>{selectedSlot?.subcategory.name}</SheetTitle>
						<SheetDescription>
							{selectedSlot?.subcategory.category.name} · {selectedSlot?.startTime} - {selectedSlot?.endTime}
						</SheetDescription>
					</SheetHeader>
					<div className="px-4 pb-4">
						{selectedSlot && DetailComponent && (
							<DetailComponent slot={selectedSlot} currentMinutes={currentMinutes} />
						)}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
