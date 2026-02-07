import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { trpc } from '@/lib/trpc';

import { formatChartDate } from './history-core';

interface WeightChartProps {
	exerciseId: string;
}

export function WeightChart({ exerciseId }: WeightChartProps) {
	const query = trpc.stats.weightProgression.useQuery({ exerciseId });
	const data = query.data ?? [];

	if (query.isLoading) {
		return <ChartSkeleton />;
	}

	if (data.length === 0) {
		return <ChartEmpty message="Aucune donnee de poids pour cet exercice" />;
	}

	const chartData = data.map((d) => ({
		date: formatChartDate(d.date),
		poids: d.maxWeight,
	}));

	return (
		<ResponsiveContainer width="100%" height={250}>
			<LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
				<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
				<XAxis dataKey="date" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
				<YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} unit=" kg" width={55} />
				<Tooltip
					contentStyle={{
						backgroundColor: 'hsl(var(--popover))',
						borderColor: 'hsl(var(--border))',
						borderRadius: '6px',
						fontSize: '12px',
						color: 'hsl(var(--popover-foreground))',
					}}
				/>
				<Line type="monotone" dataKey="poids" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
			</LineChart>
		</ResponsiveContainer>
	);
}

function ChartSkeleton() {
	return <div className="bg-muted/30 animate-pulse rounded-md h-[250px]" />;
}

function ChartEmpty({ message }: { message: string }) {
	return (
		<div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
			<p>{message}</p>
		</div>
	);
}
