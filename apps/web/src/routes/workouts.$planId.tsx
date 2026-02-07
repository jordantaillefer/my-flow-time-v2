import { closestCenter, DndContext, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2, Pencil, Play, Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ExercisePickerDialog } from '@/features/workout/exercise-picker-dialog';
import { WorkoutExerciseCard } from '@/features/workout/workout-exercise-card';
import type { WorkoutExerciseValues } from '@/features/workout/workout-exercise-form-dialog';
import { WorkoutPlanFormDialog } from '@/features/workout/workout-plan-form-dialog';
import { trpc } from '@/lib/trpc';

export const Route = createFileRoute('/workouts/$planId')({
	component: WorkoutPlanEditorPage,
});

function WorkoutPlanEditorPage() {
	const { planId } = Route.useParams();
	const utils = trpc.useUtils();
	const navigate = useNavigate();
	const [pickerOpen, setPickerOpen] = useState(false);
	const [renameOpen, setRenameOpen] = useState(false);

	const planQuery = trpc.workoutPlan.getById.useQuery({ id: planId });

	const updatePlan = trpc.workoutPlan.update.useMutation({
		onSuccess: () => {
			utils.workoutPlan.getById.invalidate({ id: planId });
			utils.workoutPlan.list.invalidate();
		},
	});

	const addExercise = trpc.workoutPlanExercise.add.useMutation({
		onSuccess: () => utils.workoutPlan.getById.invalidate({ id: planId }),
	});

	const updateExercise = trpc.workoutPlanExercise.update.useMutation({
		onSuccess: () => utils.workoutPlan.getById.invalidate({ id: planId }),
	});

	const removeExercise = trpc.workoutPlanExercise.remove.useMutation({
		onSuccess: () => utils.workoutPlan.getById.invalidate({ id: planId }),
	});

	const reorderExercises = trpc.workoutPlanExercise.reorder.useMutation({
		onSuccess: () => utils.workoutPlan.getById.invalidate({ id: planId }),
	});

	const startSession = trpc.workoutSession.start.useMutation({
		onSuccess: (data) => {
			navigate({ to: '/session/$sessionId', params: { sessionId: data.id } });
		},
	});

	if (planQuery.isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
			</div>
		);
	}

	const plan = planQuery.data;

	if (!plan) {
		return (
			<div className="py-12 text-center">
				<p className="text-muted-foreground">Plan introuvable.</p>
				<Link to="/workouts" className="text-primary mt-2 inline-block text-sm hover:underline">
					Retour aux plans
				</Link>
			</div>
		);
	}

	const exercises = plan.exercises;
	const nextOrder = exercises.length > 0 ? Math.max(...exercises.map((e) => e.order)) + 1 : 0;

	async function handlePick(exerciseId: string, values: WorkoutExerciseValues) {
		await addExercise.mutateAsync({
			workoutPlanId: planId,
			exerciseId,
			order: nextOrder,
			...values,
		});
	}

	async function handleUpdate(id: string, values: WorkoutExerciseValues) {
		await updateExercise.mutateAsync({ id, ...values });
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = exercises.findIndex((e) => e.id === active.id);
		const newIndex = exercises.findIndex((e) => e.id === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		// Build new order
		const reordered = [...exercises];
		const [moved] = reordered.splice(oldIndex, 1);
		reordered.splice(newIndex, 0, moved);

		reorderExercises.mutate(reordered.map((e, i) => ({ id: e.id, order: i })));
	}

	return (
		<div className="space-y-6">
			<div>
				<Link to="/workouts" className="text-muted-foreground mb-4 inline-flex items-center text-sm hover:underline">
					<ArrowLeft className="mr-1 h-4 w-4" />
					Plans de seance
				</Link>
				<div className="flex items-center gap-3">
					<h1 className="text-2xl font-bold">{plan.name}</h1>
					<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRenameOpen(true)}>
						<Pencil className="h-4 w-4" />
					</Button>
					{exercises.length > 0 && (
						<Button size="sm" onClick={() => startSession.mutate({ workoutPlanId: planId })} disabled={startSession.isPending}>
							<Play className="mr-1 h-4 w-4" />
							Demarrer
						</Button>
					)}
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Exercices</h2>
					<Button size="sm" onClick={() => setPickerOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Ajouter
					</Button>
				</div>

				{exercises.length === 0 && <p className="text-muted-foreground py-8 text-center text-sm">Aucun exercice dans ce plan.</p>}

				<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={exercises.map((e) => e.id)} strategy={verticalListSortingStrategy}>
						<div className="space-y-2">
							{exercises.map((item) => (
								<WorkoutExerciseCard
									key={item.id}
									item={item}
									onUpdate={(values) => handleUpdate(item.id, values)}
									onDelete={() => removeExercise.mutate({ id: item.id })}
								/>
							))}
						</div>
					</SortableContext>
				</DndContext>
			</div>

			<ExercisePickerDialog open={pickerOpen} onOpenChange={setPickerOpen} onPick={handlePick} />

			<WorkoutPlanFormDialog
				title="Renommer le plan"
				defaultValues={{ name: plan.name }}
				open={renameOpen}
				onOpenChange={setRenameOpen}
				onSubmit={async (values) => {
					await updatePlan.mutateAsync({ id: planId, ...values });
				}}
			/>
		</div>
	);
}
