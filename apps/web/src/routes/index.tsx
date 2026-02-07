import { createFileRoute } from '@tanstack/react-router';
import { DateTime } from 'luxon';

import { Badge } from '@/components/ui/badge';
import { findActiveSlotIndex } from '@/features/today/active-slot';
import { TodayTimeline } from '@/features/today/today-timeline';
import { useCurrentMinutes } from '@/features/today/use-current-minutes';
import { trpc } from '@/lib/trpc';

export const Route = createFileRoute('/')({
	component: TodayPage,
});

function TodayPage() {
	const today = DateTime.now();
	const todayISO = today.toISODate()!;
	const currentMinutes = useCurrentMinutes();

	const daysQuery = trpc.plannedDay.getRange.useQuery({
		startDate: todayISO,
		endDate: todayISO,
	});

	const slots = daysQuery.data?.[0]?.slots ?? [];
	const activeIndex = findActiveSlotIndex(slots, currentMinutes);
	const activeSlot = activeIndex >= 0 ? slots[activeIndex] : null;

	const formattedDate = today.setLocale('fr').toFormat('cccc d MMMM yyyy');
	const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

	return (
		<div className="flex gap-8">
			{/* Colonne timeline (largeur mobile) */}
			<div className="flex w-full max-w-sm flex-col gap-4">
				{/* Header */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold">Aujourd'hui</h1>
						{slots.length > 0 && (
							<span className="text-muted-foreground text-sm">
								{slots.length} creneau{slots.length > 1 ? 'x' : ''}
							</span>
						)}
					</div>
					<p className="text-muted-foreground text-sm">{capitalizedDate}</p>
					{activeSlot && (
						<Badge variant="outline" className="w-fit">
							En cours : {activeSlot.subcategory.name}
						</Badge>
					)}
				</div>

				{/* Timeline */}
				<TodayTimeline />
			</div>

			{/* Colonne stats (a venir) */}
			<div className="hidden flex-1 lg:block" />
		</div>
	);
}
