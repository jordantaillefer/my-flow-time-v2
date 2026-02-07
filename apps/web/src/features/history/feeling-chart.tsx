import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { trpc } from '@/lib/trpc';

import { formatChartDate } from './history-core';

interface FeelingChartProps {
	exerciseId?: string;
}

const FEELING_LABELS: Record<number, string> = {
	1: '😫',
	2: '😓',
	3: '😐',
	4: '💪',
	5: '🔥',
};

export function FeelingChart({ exerciseId }: FeelingChartProps) {
	const sessionsQuery = trpc.workoutSession.listHistory.useQuery({ limit: 50, exerciseId });
	const sessions = sessionsQuery.data?.sessions ?? [];

	if (sessionsQuery.isLoading) {
		return <div className="bg-muted/30 animate-pulse rounded-md h-[250px]" />;
	}

	if (sessions.length === 0) {
		return (
			<div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
				<p>Aucune donnee de ressenti</p>
			</div>
		);
	}

	const chartData = [...sessions]
		.reverse()
		.map((s) => {
			const sets = exerciseId ? s.sets.filter((set) => set.exerciseId === exerciseId) : s.sets;
			if (sets.length === 0) return null;
			const avgFeeling = Math.round((sets.reduce((sum, set) => sum + set.feeling, 0) / sets.length) * 10) / 10;
			const dateStr = typeof s.startedAt === 'string' ? s.startedAt : new Date(s.startedAt).toISOString();
			return {
				date: formatChartDate(dateStr),
				feeling: avgFeeling,
			};
		})
		.filter((d): d is { date: string; feeling: number } => d !== null);

	if (chartData.length === 0) {
		return (
			<div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
				<p>Aucune donnee de ressenti</p>
			</div>
		);
	}

	return (
		<ResponsiveContainer width="100%" height={250}>
			<LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
				<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
				<XAxis dataKey="date" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
				<YAxis
					domain={[1, 5]}
					ticks={[1, 2, 3, 4, 5]}
					className="text-xs fill-muted-foreground"
					tick={{ fontSize: 12 }}
					tickFormatter={(v: number) => FEELING_LABELS[v] ?? String(v)}
					width={35}
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: 'hsl(var(--popover))',
						borderColor: 'hsl(var(--border))',
						borderRadius: '6px',
						fontSize: '12px',
						color: 'hsl(var(--popover-foreground))',
					}}
					formatter={(value) => [FEELING_LABELS[Math.round(Number(value))] ?? value, 'Ressenti']}
				/>
				<Line
					type="monotone"
					dataKey="feeling"
					stroke="hsl(var(--chart-4, var(--primary)))"
					strokeWidth={2}
					dot={{ r: 3 }}
					activeDot={{ r: 5 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
