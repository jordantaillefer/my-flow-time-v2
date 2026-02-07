import { DateTime } from 'luxon';

/**
 * Convert JS Date.getDay() (0=Sunday) to our week system (0=Monday..6=Sunday)
 */
export function jsDateToWeekDay(date: Date): number {
	const day = date.getDay();
	return day === 0 ? 6 : day - 1;
}

/**
 * Get the ISO weekday (0=Monday..6=Sunday) for a YYYY-MM-DD string
 */
export function isoWeekday(dateStr: string): number {
	const dt = DateTime.fromISO(dateStr);
	return dt.weekday - 1; // Luxon weekday: 1=Mon..7=Sun -> 0..6
}

/**
 * Given a date string and a list of recurrences, return the matching templateId or null.
 */
export function getTemplateForDate(dateStr: string, recurrences: Array<{ dayOfWeek: number; templateId: string }>): string | null {
	const weekday = isoWeekday(dateStr);
	const match = recurrences.find((r) => r.dayOfWeek === weekday);
	return match?.templateId ?? null;
}

/**
 * Generate an array of YYYY-MM-DD strings from start to end (inclusive).
 */
export function generateDateRange(start: string, end: string): string[] {
	const dates: string[] = [];
	let current = DateTime.fromISO(start);
	const endDt = DateTime.fromISO(end);

	while (current <= endDt) {
		dates.push(current.toISODate()!);
		current = current.plus({ days: 1 });
	}

	return dates;
}
