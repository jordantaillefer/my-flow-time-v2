import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { EQUIPMENT_LABELS, EQUIPMENTS } from './equipment-labels';
import type { ExerciseData } from './exercise-card';
import { ExerciseCard } from './exercise-card';
import { ExerciseDetailSheet } from './exercise-detail-sheet';
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUPS } from './muscle-group-labels';

function useDebounce<T>(value: T, delay: number): T {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);
	return debounced;
}

export function ExerciseList() {
	const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
	const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [selectedExercise, setSelectedExercise] = useState<ExerciseData | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const debouncedSearch = useDebounce(search, 300);
	const utils = trpc.useUtils();
	const hasSeeded = useRef(false);

	const exercisesQuery = trpc.exercise.list.useQuery({
		muscleGroup: selectedGroup ?? undefined,
		equipment: selectedEquipment ?? undefined,
	});

	const seedMutation = trpc.exercise.seed.useMutation({
		onSuccess: () => utils.exercise.list.invalidate(),
	});

	// Auto-seed si la liste est vide ou incomplete
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
		if (!debouncedSearch.trim()) return exercises;

		const q = debouncedSearch.toLowerCase();
		return exercises.filter((ex) => ex.name.toLowerCase().includes(q) || ex.description.toLowerCase().includes(q));
	}, [exercisesQuery.data, debouncedSearch]);

	const hasActiveFilters = selectedGroup !== null || selectedEquipment !== null || search.trim() !== '';

	function clearFilters() {
		setSelectedGroup(null);
		setSelectedEquipment(null);
		setSearch('');
	}

	function handleSelect(exercise: ExerciseData) {
		setSelectedExercise(exercise);
		setSheetOpen(true);
	}

	const isLoading = exercisesQuery.isLoading || seedMutation.isPending;

	return (
		<div className="flex flex-col gap-4">
			{/* Search bar */}
			<div className="relative">
				<Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
				<Input placeholder="Rechercher un exercice..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
			</div>

			{/* Muscle group filters */}
			<div className="flex flex-col gap-2">
				<div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
					<button
						type="button"
						onClick={() => setSelectedGroup(null)}
						className={cn(
							'shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
							selectedGroup === null ? 'bg-primary text-primary-foreground border-primary' : 'text-muted-foreground hover:text-foreground',
						)}
					>
						Tous les muscles
					</button>
					{MUSCLE_GROUPS.map((group) => {
						const meta = MUSCLE_GROUP_LABELS[group];
						const isActive = selectedGroup === group;
						return (
							<button
								key={group}
								type="button"
								onClick={() => setSelectedGroup(isActive ? null : group)}
								className={cn(
									'shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
									isActive ? 'border-transparent text-white' : 'text-muted-foreground hover:text-foreground',
								)}
								style={
									isActive && meta
										? {
												backgroundColor: meta.color,
											}
										: undefined
								}
							>
								{meta?.label ?? group}
							</button>
						);
					})}
				</div>

				{/* Equipment filters */}
				<div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
					<button
						type="button"
						onClick={() => setSelectedEquipment(null)}
						className={cn(
							'shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
							selectedEquipment === null
								? 'bg-primary text-primary-foreground border-primary'
								: 'text-muted-foreground hover:text-foreground',
						)}
					>
						Tous les equipements
					</button>
					{EQUIPMENTS.map((equip) => {
						const meta = EQUIPMENT_LABELS[equip];
						return (
							<button
								key={equip}
								type="button"
								onClick={() => setSelectedEquipment(selectedEquipment === equip ? null : equip)}
								className={cn(
									'shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
									selectedEquipment === equip
										? 'bg-primary text-primary-foreground border-primary'
										: 'text-muted-foreground hover:text-foreground',
								)}
							>
								{meta?.label ?? equip}
							</button>
						);
					})}
				</div>
			</div>

			{/* Result count + clear filters */}
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-sm">
					{isLoading ? (
						'Chargement...'
					) : (
						<>
							{filtered.length} exercice{filtered.length !== 1 ? 's' : ''}
						</>
					)}
				</p>
				{hasActiveFilters && (
					<button
						type="button"
						onClick={clearFilters}
						className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
					>
						<X className="h-3 w-3" />
						Effacer les filtres
					</button>
				)}
			</div>

			{/* Grid */}
			{isLoading ? (
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{Array.from({ length: 12 }).map((_, i) => (
						<div key={i} className="animate-pulse overflow-hidden rounded-xl border">
							<div className="bg-muted aspect-[16/10] w-full" />
							<div className="flex gap-2 p-3">
								<div className="bg-muted h-4 w-16 rounded-full" />
								<div className="bg-muted h-4 w-12 rounded-full" />
							</div>
						</div>
					))}
				</div>
			) : filtered.length === 0 ? (
				<div className="flex flex-col items-center gap-2 py-16">
					<Search className="text-muted-foreground h-10 w-10" />
					<p className="text-muted-foreground text-sm">
						{hasActiveFilters ? 'Aucun exercice ne correspond aux filtres.' : 'Aucun exercice disponible.'}
					</p>
					{hasActiveFilters && (
						<button type="button" onClick={clearFilters} className="text-primary text-sm underline underline-offset-4">
							Effacer les filtres
						</button>
					)}
				</div>
			) : (
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{filtered.map((ex) => (
						<ExerciseCard key={ex.id} exercise={ex} onSelect={handleSelect} />
					))}
				</div>
			)}

			{/* Detail sheet */}
			<ExerciseDetailSheet exercise={selectedExercise} open={sheetOpen} onOpenChange={setSheetOpen} />
		</div>
	);
}
