import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { trpc } from '@/lib/trpc';

import { formatChartDate } from './history-core';

interface VolumeChartProps {
	exerciseId?: string;
}

export function VolumeChart({ exerciseId }: VolumeChartProps) {
	const query = trpc.stats.volumeOverTime.useQuery({ exerciseId });
	const data = query.data ?? [];

	if (query.isLoading) {
		return <div className="bg-muted/30 animate-pulse rounded-md h-[250px]" />;
	}

	if (data.length === 0) {
		return (
			<div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
				<p>Aucune donnee de volume</p>
			</div>
		);
	}

	const chartData = data.map((d) => ({
		date: formatChartDate(d.date),
		volume: d.volume,
	}));

	return (
		<ResponsiveContainer width="100%" height={250}>
			<AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
				<defs>
					<linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
						<stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
				<XAxis dataKey="date" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
				<YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} unit=" kg" width={60} />
				<Tooltip
					contentStyle={{
						backgroundColor: 'hsl(var(--popover))',
						borderColor: 'hsl(var(--border))',
						borderRadius: '6px',
						fontSize: '12px',
						color: 'hsl(var(--popover-foreground))',
					}}
				/>
				<Area
					type="monotone"
					dataKey="volume"
					stroke="hsl(var(--primary))"
					strokeWidth={2}
					fill="url(#volumeGradient)"
					dot={{ r: 3 }}
					activeDot={{ r: 5 }}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
