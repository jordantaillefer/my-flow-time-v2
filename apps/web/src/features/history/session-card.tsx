import { useNavigate } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import { computeSessionStats, formatSessionDate, formatSessionDuration, getFeelingEmoji } from './history-core';

interface SessionCardProps {
	session: {
		id: string;
		startedAt: string;
		completedAt: string | null;
		notes: string;
		workoutPlan: { name: string };
		sets: Array<{ reps: number; weight: number; feeling: number }>;
	};
}

export function SessionCard({ session }: SessionCardProps) {
	const navigate = useNavigate();
	const stats = computeSessionStats(session.sets);
	const dateStr = formatSessionDate(session.startedAt);
	const duration = session.completedAt ? formatSessionDuration(session.startedAt, session.completedAt) : '-';

	return (
		<Card
			className="cursor-pointer transition-colors hover:bg-muted/50"
			onClick={() => navigate({ to: '/history/$sessionId', params: { sessionId: session.id } })}
		>
			<CardContent className="flex items-center gap-3 p-4">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<p className="font-medium truncate">{session.workoutPlan.name}</p>
					</div>
					<p className="text-muted-foreground text-xs mt-0.5">
						{dateStr} &middot; {duration}
					</p>
					<div className="text-muted-foreground mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
						<span>{stats.totalSets} series</span>
						<span>{stats.totalReps} reps</span>
						{stats.totalVolume > 0 && <span>{stats.totalVolume} kg</span>}
						{stats.avgFeeling > 0 && <span>{getFeelingEmoji(stats.avgFeeling)}</span>}
					</div>
				</div>
				<ChevronRight className="text-muted-foreground h-4 w-4 shrink-0" />
			</CardContent>
		</Card>
	);
}
