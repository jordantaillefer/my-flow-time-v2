import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	formatMonthLabel,
	formatWeekRange,
	getCurrentISOWeek,
	getCurrentMonth,
	navigateMonth,
	navigateWeek,
} from '@/lib/calendar';

import type { CalendarView } from './schemas';

interface CalendarHeaderProps {
	view: CalendarView;
	weekStr: string;
	monthStr: string;
	onViewChange: (view: CalendarView) => void;
	onWeekChange: (week: string) => void;
	onMonthChange: (month: string) => void;
}

export function CalendarHeader({
	view,
	weekStr,
	monthStr,
	onViewChange,
	onWeekChange,
	onMonthChange,
}: CalendarHeaderProps) {
	const label = view === 'week' ? formatWeekRange(weekStr) : formatMonthLabel(monthStr);

	function handlePrev() {
		if (view === 'week') {
			onWeekChange(navigateWeek(weekStr, -1));
		} else {
			onMonthChange(navigateMonth(monthStr, -1));
		}
	}

	function handleNext() {
		if (view === 'week') {
			onWeekChange(navigateWeek(weekStr, 1));
		} else {
			onMonthChange(navigateMonth(monthStr, 1));
		}
	}

	function handleToday() {
		onWeekChange(getCurrentISOWeek());
		onMonthChange(getCurrentMonth());
	}

	return (
		<div className="flex flex-wrap items-center justify-between gap-2">
			<div className="flex items-center gap-2">
				<Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrev}>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNext}>
					<ChevronRight className="h-4 w-4" />
				</Button>
				<h2 className="text-lg font-semibold capitalize">{label}</h2>
			</div>
			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm" onClick={handleToday}>
					Aujourd'hui
				</Button>
				<div className="bg-muted inline-flex rounded-lg p-0.5">
					<Button
						variant={view === 'week' ? 'default' : 'ghost'}
						size="sm"
						className="h-7 px-3 text-xs"
						onClick={() => onViewChange('week')}
					>
						Semaine
					</Button>
					<Button
						variant={view === 'month' ? 'default' : 'ghost'}
						size="sm"
						className="h-7 px-3 text-xs"
						onClick={() => onViewChange('month')}
					>
						Mois
					</Button>
				</div>
			</div>
		</div>
	);
}
