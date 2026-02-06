import { Loader2, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { ExerciseCard } from './exercise-card';
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUPS } from './muscle-group-labels';

export function ExerciseList() {
	const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const utils = trpc.useUtils();
	const hasSeeded = useRef(false);

	const exercisesQuery = trpc.exercise.list.useQuery(
		selectedGroup ? { muscleGroup: selectedGroup } : undefined,
	);

	const seedMutation = trpc.exercise.seed.useMutation({
		onSuccess: () => utils.exercise.list.invalidate(),
	});

	// Auto-seed si la liste est vide ou incomplete (transition vers la nouvelle base)
	useEffect(() => {
		if (
			!exercisesQuery.isLoading &&
			exercisesQuery.data &&
			exercisesQuery.data.length < 100 &&
			!hasSeeded.current &&
			!seedMutation.isPending
		) {
			hasSeeded.current = true;
			seedMutation.mutate();
		}
	}, [exercisesQuery.isLoading, exercisesQuery.data, seedMutation]);

	const filtered = useMemo(() => {
		const exercises = exercisesQuery.data ?? [];
		if (!search.trim()) return exercises;

		const q = search.toLowerCase();
		return exercises.filter(
			(ex) =>
				ex.name.toLowerCase().includes(q) ||
				ex.description.toLowerCase().includes(q),
		);
	}, [exercisesQuery.data, search]);

	// Group exercises by muscleGroup for display
	const grouped = useMemo(() => {
		const map = new Map<string, typeof filtered>();
		for (const ex of filtered) {
			const list = map.get(ex.muscleGroup) ?? [];
			list.push(ex);
			map.set(ex.muscleGroup, list);
		}
		return map;
	}, [filtered]);

	return (
		<div className="flex flex-col gap-4">
			{/* Barre de recherche */}
			<div className="relative">
				<Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
				<Input
					placeholder="Rechercher un exercice..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="pl-9"
				/>
			</div>

			{/* Filtres par groupe musculaire */}
			<div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
				<button
					type="button"
					onClick={() => setSelectedGroup(null)}
					className={cn(
						'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
						selectedGroup === null
							? 'bg-primary text-primary-foreground border-primary'
							: 'text-muted-foreground hover:text-foreground',
					)}
				>
					Tous
				</button>
				{MUSCLE_GROUPS.map((group) => (
					<button
						key={group}
						type="button"
						onClick={() => setSelectedGroup(selectedGroup === group ? null : group)}
						className={cn(
							'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
							selectedGroup === group
								? 'bg-primary text-primary-foreground border-primary'
								: 'text-muted-foreground hover:text-foreground',
						)}
					>
						{MUSCLE_GROUP_LABELS[group]?.label ?? group}
					</button>
				))}
			</div>

			{/* Liste */}
			{exercisesQuery.isLoading || seedMutation.isPending ? (
				<div className="flex justify-center py-12">
					<Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
				</div>
			) : filtered.length === 0 ? (
				<p className="text-muted-foreground py-12 text-center text-sm">Aucun exercice trouve.</p>
			) : (
				<div className="flex flex-col gap-6">
					{[...grouped.entries()].map(([group, exercises]) => (
						<div key={group} className="flex flex-col gap-2">
							<h3 className="text-sm font-semibold">
								{MUSCLE_GROUP_LABELS[group]?.label ?? group}
								<span className="text-muted-foreground ml-2 font-normal">({exercises.length})</span>
							</h3>
							<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
								{exercises.map((ex) => (
									<ExerciseCard key={ex.id} exercise={ex} />
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
