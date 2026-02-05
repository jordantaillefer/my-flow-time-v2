import { DateTime, Info } from 'luxon';

const LOCALE = 'fr';

/** Return current ISO week string e.g. "2026-W06" */
export function getCurrentISOWeek(): string {
	const now = DateTime.now();
	return `${now.weekYear}-W${String(now.weekNumber).padStart(2, '0')}`;
}

/** Return current month string e.g. "2026-02" */
export function getCurrentMonth(): string {
	return DateTime.now().toFormat('yyyy-MM');
}

/** Parse a week param "2026-W06" into start (Monday) and end (Sunday) dates */
export function parseWeekParam(param: string): { start: DateTime; end: DateTime } {
	const start = DateTime.fromISO(param);
	return { start, end: start.plus({ days: 6 }) };
}

/** Navigate to prev/next week, return new week string */
export function navigateWeek(current: string, direction: -1 | 1): string {
	const dt = DateTime.fromISO(current);
	const moved = dt.plus({ weeks: direction });
	return `${moved.weekYear}-W${String(moved.weekNumber).padStart(2, '0')}`;
}

/** Format week range e.g. "3 fev. - 9 fev. 2026" */
export function formatWeekRange(weekStr: string): string {
	const { start, end } = parseWeekParam(weekStr);
	const sameMonth = start.month === end.month;

	if (sameMonth) {
		return `${start.day} - ${end.setLocale(LOCALE).toFormat('d MMM yyyy')}`;
	}
	return `${start.setLocale(LOCALE).toFormat('d MMM')} - ${end.setLocale(LOCALE).toFormat('d MMM yyyy')}`;
}

/** Format day header from YYYY-MM-DD -> { dayName: "Lun", dayNumber: "3" } */
export function formatDayHeader(dateStr: string): { dayName: string; dayNumber: string } {
	const dt = DateTime.fromISO(dateStr).setLocale(LOCALE);
	return {
		dayName: dt.toFormat('ccc').replace('.', ''),
		dayNumber: dt.toFormat('d'),
	};
}

/** Check if a YYYY-MM-DD string is today */
export function isToday(dateStr: string): boolean {
	return dateStr === DateTime.now().toISODate();
}

/** Get 7 YYYY-MM-DD strings for a week param */
export function getWeekDatesFromParam(weekStr: string): string[] {
	const { start } = parseWeekParam(weekStr);
	return Array.from({ length: 7 }, (_, i) => start.plus({ days: i }).toISODate()!);
}

/** Navigate to prev/next month, return new month string */
export function navigateMonth(current: string, direction: -1 | 1): string {
	const dt = DateTime.fromFormat(current, 'yyyy-MM');
	return dt.plus({ months: direction }).toFormat('yyyy-MM');
}

/** Format month label e.g. "Fevrier 2026" */
export function formatMonthLabel(monthStr: string): string {
	const dt = DateTime.fromFormat(monthStr, 'yyyy-MM').setLocale(LOCALE);
	const label = dt.toFormat('MMMM yyyy');
	return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Get the week string containing a given date */
export function getWeekForDate(dateStr: string): string {
	const dt = DateTime.fromISO(dateStr);
	return `${dt.weekYear}-W${String(dt.weekNumber).padStart(2, '0')}`;
}

/** Get all dates needed for a month grid (including padding days from prev/next months) */
export function getMonthGridDates(monthStr: string): string[] {
	const dt = DateTime.fromFormat(monthStr, 'yyyy-MM');
	const firstDay = dt.startOf('month');
	const lastDay = dt.endOf('month');

	// Pad to start on Monday (weekday 1 in Luxon)
	const gridStart = firstDay.startOf('week');
	// Pad to end on Sunday
	const gridEnd = lastDay.endOf('week').startOf('day');

	const dates: string[] = [];
	let current = gridStart;
	while (current <= gridEnd) {
		dates.push(current.toISODate()!);
		current = current.plus({ days: 1 });
	}
	return dates;
}

/** Get weekday headers for the calendar grid */
export function getWeekdayHeaders(): string[] {
	return Info.weekdays('short', { locale: LOCALE }).map((d) => d.replace('.', ''));
}

/** Check if a date string belongs to a given month string */
export function isInMonth(dateStr: string, monthStr: string): boolean {
	return dateStr.startsWith(monthStr);
}

// ── Hourly grid helpers ──────────────────────────────────────────────

export const HOUR_HEIGHT = 64; // px per hour
export const DAY_START_HOUR = 0; // first visible hour
export const DAY_END_HOUR = 23; // last visible hour

/** Convert "HH:mm" to total minutes since midnight */
export function timeToMinutes(time: string): number {
	const [h, m] = time.split(':').map(Number);
	return h * 60 + m;
}

/** Convert total minutes to pixel offset from grid top */
export function minutesToPosition(minutes: number): number {
	return ((minutes - DAY_START_HOUR * 60) * HOUR_HEIGHT) / 60;
}

/** Compute absolute { top, height } in px for a time slot */
export function slotStyle(startTime: string, endTime: string): { top: number; height: number } {
	const startMin = timeToMinutes(startTime);
	const endMin = timeToMinutes(endTime);
	return {
		top: minutesToPosition(startMin),
		height: ((endMin - startMin) * HOUR_HEIGHT) / 60,
	};
}
