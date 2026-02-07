import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { CalendarHeader } from '@/features/calendar/calendar-header';
import { MonthView } from '@/features/calendar/month-view';
import { calendarSearchSchema, type CalendarView } from '@/features/calendar/schemas';
import { WeekView } from '@/features/calendar/week-view';
import { getCurrentISOWeek, getCurrentMonth } from '@/lib/calendar';

export const Route = createFileRoute('/calendar')({
	validateSearch: calendarSearchSchema,
	component: CalendarPage,
});

function CalendarPage() {
	const { view, week, month } = Route.useSearch();
	const navigate = useNavigate({ from: '/calendar' });

	const weekStr = week ?? getCurrentISOWeek();
	const monthStr = month ?? getCurrentMonth();

	function setView(newView: CalendarView) {
		navigate({ search: { view: newView, week: weekStr, month: monthStr } });
	}

	function setWeek(newWeek: string) {
		navigate({ search: { view: 'week', week: newWeek, month: monthStr } });
	}

	function setMonth(newMonth: string) {
		navigate({ search: { view: 'month', week: weekStr, month: newMonth } });
	}

	function handleNavigateToWeek(targetWeek: string) {
		navigate({ search: { view: 'week', week: targetWeek, month: monthStr } });
	}

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold">Calendrier</h1>
				<p className="text-muted-foreground mt-1">Planifie tes journees.</p>
			</div>

			<CalendarHeader
				view={view}
				weekStr={weekStr}
				monthStr={monthStr}
				onViewChange={setView}
				onWeekChange={setWeek}
				onMonthChange={setMonth}
			/>

			{view === 'week' ? <WeekView weekStr={weekStr} /> : <MonthView monthStr={monthStr} onNavigateToWeek={handleNavigateToWeek} />}
		</div>
	);
}
