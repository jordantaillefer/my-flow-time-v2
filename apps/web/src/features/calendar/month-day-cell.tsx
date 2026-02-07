import { getWeekForDate, isInMonth, isToday } from '@/lib/calendar';
import { cn } from '@/lib/utils';

import type { PlannedDayData } from './types';

interface MonthDayCellProps {
	date: string;
	monthStr: string;
	day: PlannedDayData | undefined;
	onNavigateToWeek: (weekStr: string) => void;
}

export function MonthDayCell({ date, monthStr, day, onNavigateToWeek }: MonthDayCellProps) {
	const today = isToday(date);
	const inMonth = isInMonth(date, monthStr);
	const dayNumber = date.split('-')[2].replace(/^0/, '');
	const slotCount = day?.slots.length ?? 0;

	return (
		<button
			onClick={() => onNavigateToWeek(getWeekForDate(date))}
			className={cn(
				'flex min-h-[80px] flex-col rounded-lg border p-1.5 text-left transition-colors hover:bg-accent',
				!inMonth && 'opacity-40',
				today && 'border-primary',
			)}
		>
			<span
				className={cn(
					'text-xs font-medium',
					today && 'bg-primary text-primary-foreground inline-flex h-5 w-5 items-center justify-center rounded-full',
				)}
			>
				{dayNumber}
			</span>

			{day?.template && <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: day.template.color }} />}

			{slotCount > 0 && (
				<span className="text-muted-foreground mt-auto text-[10px]">
					{slotCount} creneau{slotCount > 1 ? 'x' : ''}
				</span>
			)}
		</button>
	);
}
