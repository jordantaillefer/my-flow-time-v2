import { Eraser, MoreHorizontal, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDayHeader, isToday } from '@/lib/calendar';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { ApplyTemplateMenu } from './apply-template-menu';
import { PlannedSlotFormDialog } from './planned-slot-form-dialog';
import type { PlannedSlotValues } from './schemas';
import type { PlannedDayData } from './types';

interface DayColumnHeaderProps {
	date: string;
	day: PlannedDayData | undefined;
}

export function DayColumnHeader({ date, day }: DayColumnHeaderProps) {
	const utils = trpc.useUtils();
	const { dayName, dayNumber } = formatDayHeader(date);
	const today = isToday(date);

	const createSlot = trpc.plannedSlot.create.useMutation({
		onSuccess: () => utils.plannedDay.getRange.invalidate(),
	});
	const applyTemplate = trpc.plannedDay.applyTemplate.useMutation({
		onSuccess: () => utils.plannedDay.getRange.invalidate(),
	});
	const clearDay = trpc.plannedDay.clearDay.useMutation({
		onSuccess: () => utils.plannedDay.getRange.invalidate(),
	});

	const slots = day?.slots ?? [];
	const nextOrder = slots.length > 0 ? Math.max(...slots.map((s) => s.order)) + 1 : 0;

	return (
		<div className="flex flex-col items-center gap-1 py-2">
			<div className="flex w-full items-center justify-between px-1">
				<div className="flex items-center gap-1.5">
					<span className="text-muted-foreground text-xs font-medium uppercase">{dayName}</span>
					<span
						className={cn(
							'text-sm font-semibold',
							today && 'bg-primary text-primary-foreground inline-flex h-6 w-6 items-center justify-center rounded-full',
						)}
					>
						{dayNumber}
					</span>
				</div>
				<div className="flex items-center gap-0.5">
					<PlannedSlotFormDialog
						title="Nouveau creneau"
						trigger={
							<Button variant="ghost" size="icon" className="h-6 w-6">
								<Plus className="h-3.5 w-3.5" />
							</Button>
						}
						onSubmit={async (values: PlannedSlotValues) => {
							await createSlot.mutateAsync({
								date,
								order: nextOrder,
								...values,
							});
						}}
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-6 w-6">
								<MoreHorizontal className="h-3.5 w-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<ApplyTemplateMenu onApply={(templateId) => applyTemplate.mutate({ date, templateId })} />
							<DropdownMenuItem onClick={() => clearDay.mutate({ date })}>
								<Eraser className="mr-2 h-4 w-4" />
								Vider la journee
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{day?.template && (
				<span
					className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
					style={{ backgroundColor: day.template.color + '20', color: day.template.color }}
				>
					<span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: day.template.color }} />
					{day.template.name}
				</span>
			)}
		</div>
	);
}
