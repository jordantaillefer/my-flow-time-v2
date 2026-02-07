import { Loader2 } from 'lucide-react';

import { getMonthGridDates, getWeekdayHeaders } from '@/lib/calendar';
import { trpc } from '@/lib/trpc';

import { MonthDayCell } from './month-day-cell';

interface MonthViewProps {
	monthStr: string;
	onNavigateToWeek: (weekStr: string) => void;
}

export function MonthView({ monthStr, onNavigateToWeek }: MonthViewProps) {
	const gridDates = getMonthGridDates(monthStr);
	const headers = getWeekdayHeaders();

	const startDate = gridDates[0];
	const endDate = gridDates[gridDates.length - 1];

	const daysQuery = trpc.plannedDay.getRange.useQuery({
		startDate,
		endDate,
	});

	if (daysQuery.isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
			</div>
		);
	}

	const days = daysQuery.data ?? [];
	const daysByDate = new Map(days.map((d) => [d.date, d]));

	return (
		<div>
			{/* Weekday headers */}
			<div className="grid grid-cols-7 gap-1 mb-1">
				{headers.map((h) => (
					<div key={h} className="text-muted-foreground text-center text-xs font-medium py-1 uppercase">
						{h}
					</div>
				))}
			</div>

			{/* Day grid */}
			<div className="grid grid-cols-7 gap-1">
				{gridDates.map((date) => (
					<MonthDayCell key={date} date={date} monthStr={monthStr} day={daysByDate.get(date)} onNavigateToWeek={onNavigateToWeek} />
				))}
			</div>
		</div>
	);
}
