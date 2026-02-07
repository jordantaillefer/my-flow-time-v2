import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUPS } from '@/features/exercises/muscle-group-labels';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { WorkoutExerciseFormDialog, type WorkoutExerciseValues } from './workout-exercise-form-dialog';

interface ExercisePickerDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onPick: (exerciseId: string, values: WorkoutExerciseValues) => Promise<void>;
}

export function ExercisePickerDialog({ open, onOpenChange, onPick }: ExercisePickerDialogProps) {
	const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [pickedExercise, setPickedExercise] = useState<{ id: string; name: string } | null>(null);
	const [configOpen, setConfigOpen] = useState(false);

	const exercisesQuery = trpc.exercise.list.useQuery(
		{ muscleGroup: selectedGroup ?? undefined },
		{ enabled: open },
	);

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen);
		if (nextOpen) {
			setSelectedGroup(null);
			setSearch('');
			setPickedExercise(null);
		}
	}

	const filtered = useMemo(() => {
		const exercises = exercisesQuery.data ?? [];
		if (!search.trim()) return exercises;
		const q = search.toLowerCase();
		return exercises.filter((ex) => ex.name.toLowerCase().includes(q));
	}, [exercisesQuery.data, search]);

	function handleExerciseClick(ex: { id: string; name: string }) {
		setPickedExercise(ex);
		setConfigOpen(true);
	}

	async function handleConfig(values: WorkoutExerciseValues) {
		if (!pickedExercise) return;
		await onPick(pickedExercise.id, values);
		setPickedExercise(null);
		onOpenChange(false);
	}

	return (
		<>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent className="max-h-[85vh] max-w-lg overflow-hidden flex flex-col">
					<DialogHeader>
						<DialogTitle>Ajouter un exercice</DialogTitle>
					</DialogHeader>

					{/* Search */}
					<div className="relative">
						<Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
						<Input
							placeholder="Rechercher..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-9"
						/>
					</div>

					{/* Muscle group chips */}
					<div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-1">
						<button
							type="button"
							onClick={() => setSelectedGroup(null)}
							className={cn(
								'shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
								selectedGroup === null
									? 'bg-primary text-primary-foreground border-primary'
									: 'text-muted-foreground hover:text-foreground',
							)}
						>
							Tous
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
										isActive
											? 'border-transparent text-white'
											: 'text-muted-foreground hover:text-foreground',
									)}
									style={isActive && meta ? { backgroundColor: meta.color } : undefined}
								>
									{meta?.label ?? group}
								</button>
							);
						})}
					</div>

					{/* Exercise grid */}
					<div className="flex-1 overflow-y-auto -mx-2 px-2">
						{exercisesQuery.isLoading ? (
							<p className="text-muted-foreground py-8 text-center text-sm">Chargement...</p>
						) : filtered.length === 0 ? (
							<div className="flex flex-col items-center gap-2 py-8">
								<Search className="text-muted-foreground h-8 w-8" />
								<p className="text-muted-foreground text-sm">Aucun exercice trouve.</p>
								{search && (
									<button
										type="button"
										onClick={() => setSearch('')}
										className="text-primary text-sm underline underline-offset-4"
									>
										Effacer la recherche
									</button>
								)}
							</div>
						) : (
							<div className="grid gap-2 sm:grid-cols-2">
								{filtered.map((ex) => {
									const group = MUSCLE_GROUP_LABELS[ex.muscleGroup];
									return (
										<button
											key={ex.id}
											type="button"
											onClick={() => handleExerciseClick(ex)}
											className="bg-card flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent"
										>
											<div className="h-10 w-10 shrink-0 overflow-hidden rounded">
												{ex.imageUrl ? (
													<img
														src={ex.imageUrl}
														alt={ex.name}
														loading="lazy"
														className="h-full w-full object-cover"
													/>
												) : (
													<div
														className="flex h-full w-full items-center justify-center text-[10px] font-bold text-white/60"
														style={{ backgroundColor: group?.color ?? 'oklch(0.35 0.05 275)' }}
													>
														{ex.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
													</div>
												)}
											</div>
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-medium">{ex.name}</p>
												{group && (
													<Badge
														variant="secondary"
														className="mt-1 text-[10px]"
														style={{
															backgroundColor: `color-mix(in oklch, ${group.color} 25%, transparent)`,
															color: group.color,
														}}
													>
														{group.label}
													</Badge>
												)}
											</div>
										</button>
									);
								})}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>

			<WorkoutExerciseFormDialog
				exerciseName={pickedExercise?.name}
				open={configOpen}
				onOpenChange={setConfigOpen}
				onSubmit={handleConfig}
			/>
		</>
	);
}
