import { timeToMinutes } from '@/lib/calendar';

import type { PlannedDayData } from '../calendar/types';

type Slot = PlannedDayData['slots'][number];

export type SlotStatus = 'past' | 'active' | 'upcoming';

export function getSlotStatus(slot: Slot, currentMinutes: number): SlotStatus {
	const start = timeToMinutes(slot.startTime);
	const end = timeToMinutes(slot.endTime);

	if (currentMinutes >= end) return 'past';
	if (currentMinutes >= start && currentMinutes < end) return 'active';
	return 'upcoming';
}

export function findActiveSlotIndex(slots: Slot[], currentMinutes: number): number {
	return slots.findIndex((slot) => getSlotStatus(slot, currentMinutes) === 'active');
}

export function getSlotProgress(slot: Slot, currentMinutes: number): number {
	const start = timeToMinutes(slot.startTime);
	const end = timeToMinutes(slot.endTime);
	const duration = end - start;

	if (duration <= 0) return 0;

	const elapsed = currentMinutes - start;
	return Math.max(0, Math.min(100, (elapsed / duration) * 100));
}
