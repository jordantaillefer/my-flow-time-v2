import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { DAYS_OF_WEEK } from './schemas';

interface RecurrencePickerProps {
	templateId: string;
}

export function RecurrencePicker({ templateId }: RecurrencePickerProps) {
	const utils = trpc.useUtils();
	const recurrencesQuery = trpc.templateRecurrence.list.useQuery();
	const setRecurrence = trpc.templateRecurrence.set.useMutation({
		onSuccess: () => {
			utils.templateRecurrence.list.invalidate();
			utils.dayTemplate.list.invalidate();
		},
	});
	const unsetRecurrence = trpc.templateRecurrence.unset.useMutation({
		onSuccess: () => {
			utils.templateRecurrence.list.invalidate();
			utils.dayTemplate.list.invalidate();
		},
	});

	const recurrences = recurrencesQuery.data ?? [];

	function getRecurrenceForDay(dayOfWeek: number) {
		return recurrences.find((r) => r.dayOfWeek === dayOfWeek);
	}

	function handleToggle(dayOfWeek: number) {
		const existing = getRecurrenceForDay(dayOfWeek);
		if (existing && existing.templateId === templateId) {
			unsetRecurrence.mutate({ dayOfWeek });
		} else {
			setRecurrence.mutate({ templateId, dayOfWeek });
		}
	}

	return (
		<div className="space-y-2">
			<p className="text-sm font-medium">Jours de la semaine</p>
			<div className="flex gap-2">
				{DAYS_OF_WEEK.map((day) => {
					const recurrence = getRecurrenceForDay(day.value);
					const isAssignedHere = recurrence?.templateId === templateId;
					const isAssignedElsewhere = recurrence && recurrence.templateId !== templateId;
					return (
						<div key={day.value} className="flex flex-col items-center gap-1">
							<button
								type="button"
								onClick={() => handleToggle(day.value)}
								className={cn(
									'flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition-colors',
									isAssignedHere ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-accent',
								)}
							>
								{day.short}
							</button>
							{isAssignedElsewhere && (
								<span className="text-muted-foreground text-[10px]">
									{(recurrence as { template: { name: string } }).template.name.slice(0, 4)}...
								</span>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
