import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Clock, Dumbbell, Hash, Loader2, Repeat, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { Route } from '@/routes/history.$sessionId';

import { computeSessionStats, formatSessionDate, formatSessionDuration, getFeelingEmoji, groupSetsByExercise } from './history-core';
import { SessionExerciseTable } from './session-exercise-table';
import { StatCard } from './stat-card';

export function SessionDetailPage() {
	const { sessionId } = Route.useParams();
	const navigate = useNavigate();

	const sessionQuery = trpc.workoutSession.getById.useQuery({ id: sessionId });
	const session = sessionQuery.data;

	if (sessionQuery.isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
			</div>
		);
	}

	if (!session) {
		return (
			<div className="space-y-4">
				<p className="text-muted-foreground text-center py-12">Seance introuvable.</p>
				<Button variant="ghost" onClick={() => navigate({ to: '/history' })}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Retour a l'historique
				</Button>
			</div>
		);
	}

	const stats = computeSessionStats(session.sets);
	const startedAt = typeof session.startedAt === 'string' ? session.startedAt : new Date(session.startedAt).toISOString();
	const completedAt =
		session.completedAt ? (typeof session.completedAt === 'string' ? session.completedAt : new Date(session.completedAt).toISOString()) : null;
	const dateStr = formatSessionDate(startedAt);
	const duration = completedAt ? formatSessionDuration(startedAt, completedAt) : '-';
	const exerciseGroups = groupSetsByExercise(session.sets);
	const exerciseCount = exerciseGroups.length;

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" onClick={() => navigate({ to: '/history' })}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h1 className="text-xl font-bold">{session.workoutPlan?.name ?? 'Seance'}</h1>
					<p className="text-muted-foreground text-sm">
						{dateStr} &middot; {duration}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				<StatCard label="Duree" value={duration} icon={Clock} />
				<StatCard label="Exercices" value={exerciseCount} icon={Dumbbell} />
				<StatCard label="Series" value={stats.totalSets} icon={Hash} />
				<StatCard label="Reps" value={stats.totalReps} icon={Repeat} />
				<StatCard label="Volume" value={stats.totalVolume > 0 ? `${stats.totalVolume} kg` : '-'} icon={TrendingUp} />
				<StatCard label="Ressenti" value={stats.avgFeeling > 0 ? getFeelingEmoji(stats.avgFeeling) : '-'} icon={Dumbbell} />
			</div>

			{session.notes && (
				<div className="bg-muted/50 rounded-md p-3">
					<p className="text-muted-foreground text-xs mb-1">Notes</p>
					<p className="text-sm">{session.notes}</p>
				</div>
			)}

			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Detail par exercice</h2>
				{exerciseGroups.map((group) => (
					<SessionExerciseTable key={group.exerciseId} group={group} />
				))}
			</div>
		</div>
	);
}
