import { BarChart3, Dumbbell, Hash, Loader2, TrendingUp, Weight } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

import { ExerciseFilter } from './exercise-filter';
import { SessionCard } from './session-card';
import { StatCard } from './stat-card';
import { StatsPageSection } from './stats-page-section';

const PAGE_SIZE = 10;

export function HistoryPage() {
	const [exerciseId, setExerciseId] = useState<string | undefined>();
	const [limit, setLimit] = useState(PAGE_SIZE);

	const historyQuery = trpc.workoutSession.listHistory.useQuery({ limit, exerciseId });
	const sessions = historyQuery.data?.sessions ?? [];
	const total = historyQuery.data?.total ?? 0;
	const hasMore = sessions.length < total;

	const summaryQuery = trpc.stats.exerciseSummary.useQuery(
		{ exerciseId: exerciseId! },
		{ enabled: !!exerciseId },
	);

	// Compute global stats from loaded sessions
	const globalStats = sessions.reduce(
		(acc, s) => {
			acc.totalSets += s.sets.length;
			acc.totalVolume += s.sets.reduce((sum, set) => sum + set.reps * set.weight, 0);
			return acc;
		},
		{ totalSets: 0, totalVolume: 0 },
	);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Historique</h1>
				<p className="text-muted-foreground mt-1">Suivez votre progression et consultez vos seances passees</p>
			</div>

			<ExerciseFilter value={exerciseId} onChange={setExerciseId} />

			{/* Summary stats */}
			{exerciseId && summaryQuery.data ? (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					<StatCard label="Seances" value={summaryQuery.data.totalSessions} icon={BarChart3} />
					<StatCard label="Series" value={summaryQuery.data.totalSets} icon={Hash} />
					<StatCard label="Meilleur poids" value={summaryQuery.data.bestWeight > 0 ? `${summaryQuery.data.bestWeight} kg` : '-'} icon={Weight} />
					<StatCard label="Meilleur volume" value={summaryQuery.data.bestVolume > 0 ? `${summaryQuery.data.bestVolume} kg` : '-'} icon={TrendingUp} />
					<StatCard label="Dernier poids" value={summaryQuery.data.lastWeight > 0 ? `${summaryQuery.data.lastWeight} kg` : '-'} icon={Dumbbell} />
					<StatCard label="Seances totales" value={total} icon={BarChart3} />
				</div>
			) : (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					<StatCard label="Seances" value={total} icon={BarChart3} />
					<StatCard label="Series" value={globalStats.totalSets} icon={Hash} />
					<StatCard label="Volume total" value={globalStats.totalVolume > 0 ? `${globalStats.totalVolume} kg` : '-'} icon={TrendingUp} />
				</div>
			)}

			{/* Charts */}
			<StatsPageSection exerciseId={exerciseId} />

			{/* Sessions list */}
			<div className="space-y-3">
				<h2 className="text-lg font-semibold">Seances recentes</h2>

				{historyQuery.isLoading ? (
					<div className="flex justify-center py-12">
						<Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
					</div>
				) : sessions.length === 0 ? (
					<p className="text-muted-foreground py-8 text-center text-sm">Aucune seance completee.</p>
				) : (
					<>
						<div className="space-y-2">
							{sessions.map((session) => (
								<SessionCard key={session.id} session={session} />
							))}
						</div>
						{hasMore && (
							<div className="flex justify-center pt-2">
								<Button
									variant="outline"
									onClick={() => setLimit((l) => l + PAGE_SIZE)}
									disabled={historyQuery.isFetching}
								>
									{historyQuery.isFetching ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : null}
									Charger plus
								</Button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
