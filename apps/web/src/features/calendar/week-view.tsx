import { Loader2 } from 'lucide-react';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';

import {
	DAY_END_HOUR,
	DAY_START_HOUR,
	formatDayHeader,
	getWeekDatesFromParam,
	HOUR_HEIGHT,
	isToday,
	minutesToPosition,
	parseWeekParam,
} from '@/lib/calendar';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { DayColumnHeader } from './day-column-header';
import { PlannedSlotFormDialog } from './planned-slot-form-dialog';
import type { PlannedSlotValues } from './schemas';
import { TimeSlotBlock } from './time-slot-block';
import type { PlannedDayData } from './types';

interface WeekViewProps {
	weekStr: string;
}

const HOURS = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }, (_, i) => DAY_START_HOUR + i);
const GRID_HEIGHT = HOURS.length * HOUR_HEIGHT;
const GRID_TOP_OFFSET = 10;
const GUTTER_WIDTH = 'w-14';

function NowLine() {
	const now = DateTime.now();
	const minutes = now.hour * 60 + now.minute;
	const top = minutesToPosition(minutes);

	if (top < 0 || top > GRID_HEIGHT) return null;

	return (
		<div className="pointer-events-none absolute inset-x-0 z-20" style={{ top }}>
			<div className="bg-destructive relative h-0.5 w-full">
				<div className="bg-destructive absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full" />
			</div>
		</div>
	);
}

function HourGutter() {
	return (
		<div className={`${GUTTER_WIDTH} relative shrink-0`}>
			{HOURS.map((hour) => (
				<div
					key={hour}
					className="text-muted-foreground absolute -translate-y-1/2 pr-2 text-right text-[11px]"
					style={{ top: GRID_TOP_OFFSET + (hour - DAY_START_HOUR) * HOUR_HEIGHT, right: 0 }}
				>
					{String(hour).padStart(2, '0')}:00
				</div>
			))}
		</div>
	);
}

function DayGridColumn({
	day,
	showNowLine,
	onHourClick,
}: {
	day: PlannedDayData | undefined;
	showNowLine: boolean;
	onHourClick?: (startTime: string, endTime: string) => void;
}) {
	const slots = day?.slots ?? [];

	function handleBackgroundClick(e: React.MouseEvent<HTMLDivElement>) {
		if (!onHourClick) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const y = e.clientY - rect.top;
		const hour = Math.floor(y / HOUR_HEIGHT) + DAY_START_HOUR;
		const clamped = Math.max(DAY_START_HOUR, Math.min(DAY_END_HOUR, hour));
		const startTime = `${String(clamped).padStart(2, '0')}:00`;
		const endHour = clamped + 1;
		const endTime = endHour > 23 ? '23:59' : `${String(endHour).padStart(2, '0')}:00`;
		onHourClick(startTime, endTime);
	}

	return (
		<div className="relative h-full border-l">
			{HOURS.map((hour) => (
				<div
					key={hour}
					className="border-border absolute inset-x-0 border-t"
					style={{ top: GRID_TOP_OFFSET + (hour - DAY_START_HOUR) * HOUR_HEIGHT }}
				/>
			))}

			<div className="absolute inset-x-0 bottom-0" style={{ top: GRID_TOP_OFFSET }}>
				<div className="relative h-full">
					{/* Clickable background — sits behind slots */}
					<div className="absolute inset-0 cursor-pointer" onClick={handleBackgroundClick} />
					{slots.map((slot) => (
						<TimeSlotBlock key={slot.id} slot={slot} />
					))}
					{showNowLine && <NowLine />}
				</div>
			</div>
		</div>
	);
}

export function WeekView({ weekStr }: WeekViewProps) {
	const dates = getWeekDatesFromParam(weekStr);
	const { start, end } = parseWeekParam(weekStr);
	const scrollRef = useRef<HTMLDivElement>(null);
	const utils = trpc.useUtils();

	const todayStr = DateTime.now().toISODate();

	const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
		const idx = dates.indexOf(todayStr!);
		return idx >= 0 ? idx : 0;
	});

	// Click-to-add state
	const [addSlotState, setAddSlotState] = useState<{
		date: string;
		startTime: string;
		endTime: string;
	} | null>(null);

	const createSlot = trpc.plannedSlot.create.useMutation({
		onSuccess: () => utils.plannedDay.getRange.invalidate(),
	});

	// Reset selected day when week changes
	useEffect(() => {
		const newDates = getWeekDatesFromParam(weekStr);
		const idx = newDates.indexOf(todayStr!);
		setSelectedDayIndex(idx >= 0 ? idx : 0);
	}, [weekStr, todayStr]);

	const daysQuery = trpc.plannedDay.getRange.useQuery({
		startDate: start.toISODate()!,
		endDate: end.toISODate()!,
	});

	// Auto-scroll to current hour on mount
	useEffect(() => {
		if (!scrollRef.current) return;
		const now = DateTime.now();
		const minutes = now.hour * 60 + now.minute;
		const top = GRID_TOP_OFFSET + minutesToPosition(minutes);
		const containerHeight = scrollRef.current.clientHeight;
		scrollRef.current.scrollTop = Math.max(0, top - containerHeight / 3);
	}, []);

	if (daysQuery.isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
			</div>
		);
	}

	const days = daysQuery.data ?? [];
	const daysByDate = new Map(days.map((d) => [d.date, d]));
	const isTodayInWeek = dates.includes(todayStr!);

	return (
		<div className="flex flex-col overflow-hidden rounded-lg border">
			{/* ── Mobile: day picker tabs ────────────────────── */}
			<div className="flex border-b md:hidden">
				{dates.map((date, i) => {
					const { dayName, dayNumber } = formatDayHeader(date);
					const selected = i === selectedDayIndex;
					const today = isToday(date);
					return (
						<button
							key={date}
							onClick={() => setSelectedDayIndex(i)}
							className={cn(
								'flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors',
								selected ? 'bg-primary/10' : 'hover:bg-muted',
							)}
						>
							<span className="text-muted-foreground text-[10px] font-medium uppercase">{dayName}</span>
							<span
								className={cn(
									'text-xs font-semibold',
									today &&
										'bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full',
								)}
							>
								{dayNumber}
							</span>
						</button>
					);
				})}
			</div>

			{/* ── Mobile: selected day action bar ────────────── */}
			<div className="border-b md:hidden">
				<DayColumnHeader date={dates[selectedDayIndex]} day={daysByDate.get(dates[selectedDayIndex])} />
			</div>

			{/* ── Desktop: header row ────────────────────────── */}
			<div className="hidden border-b md:block">
				<div className="flex">
					<div className={`${GUTTER_WIDTH} shrink-0`} />
					<div className="grid flex-1 grid-cols-7">
						{dates.map((date) => (
							<DayColumnHeader key={date} date={date} day={daysByDate.get(date)} />
						))}
					</div>
				</div>
			</div>

			{/* ── Scrollable body ────────────────────────────── */}
			<div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
				{/* Mobile: single column */}
				<div className="flex md:hidden" style={{ height: GRID_HEIGHT + GRID_TOP_OFFSET }}>
					<HourGutter />
					<div className="flex-1">
						<DayGridColumn
							day={daysByDate.get(dates[selectedDayIndex])}
							showNowLine={isTodayInWeek && dates[selectedDayIndex] === todayStr}
							onHourClick={(startTime, endTime) =>
								setAddSlotState({ date: dates[selectedDayIndex], startTime, endTime })
							}
						/>
					</div>
				</div>

				{/* Desktop: all 7 columns */}
				<div className="hidden md:flex" style={{ height: GRID_HEIGHT + GRID_TOP_OFFSET }}>
					<HourGutter />
					<div className="grid flex-1 grid-cols-7">
						{dates.map((date) => (
							<DayGridColumn
								key={date}
								day={daysByDate.get(date)}
								showNowLine={isTodayInWeek && date === todayStr}
								onHourClick={(startTime, endTime) =>
									setAddSlotState({ date, startTime, endTime })
								}
							/>
						))}
					</div>
				</div>
			</div>

			{/* ── Click-to-add dialog ────────────────────────── */}
			<PlannedSlotFormDialog
				title="Nouveau creneau"
				open={addSlotState !== null}
				onOpenChange={(open) => {
					if (!open) setAddSlotState(null);
				}}
				defaultValues={
					addSlotState
						? { startTime: addSlotState.startTime, endTime: addSlotState.endTime, subcategoryId: '' }
						: undefined
				}
				onSubmit={async (values: PlannedSlotValues) => {
					if (!addSlotState) return;
					const day = daysByDate.get(addSlotState.date);
					const slots = day?.slots ?? [];
					const nextOrder = slots.length > 0 ? Math.max(...slots.map((s) => s.order)) + 1 : 0;
					await createSlot.mutateAsync({
						date: addSlotState.date,
						order: nextOrder,
						...values,
					});
				}}
			/>
		</div>
	);
}
