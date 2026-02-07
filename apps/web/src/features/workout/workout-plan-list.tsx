import { Link } from '@tanstack/react-router';
import { Dumbbell, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

import { WorkoutPlanFormDialog } from './workout-plan-form-dialog';

export function WorkoutPlanList() {
	const utils = trpc.useUtils();
	const plansQuery = trpc.workoutPlan.list.useQuery();
	const createPlan = trpc.workoutPlan.create.useMutation({
		onSuccess: () => utils.workoutPlan.list.invalidate(),
	});
	const updatePlan = trpc.workoutPlan.update.useMutation({
		onSuccess: () => utils.workoutPlan.list.invalidate(),
	});
	const deletePlan = trpc.workoutPlan.delete.useMutation({
		onSuccess: () => utils.workoutPlan.list.invalidate(),
	});

	if (plansQuery.isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
			</div>
		);
	}

	const plans = plansQuery.data ?? [];

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<WorkoutPlanFormDialog
					title="Nouveau plan"
					trigger={
						<Button size="sm">
							<Plus className="mr-2 h-4 w-4" />
							Nouveau plan
						</Button>
					}
					onSubmit={async (values) => {
						await createPlan.mutateAsync(values);
					}}
				/>
			</div>

			{plans.length === 0 && <p className="text-muted-foreground py-8 text-center text-sm">Aucun plan de seance.</p>}

			<div className="grid gap-4 sm:grid-cols-2">
				{plans.map((plan) => (
					<Card key={plan.id}>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<div className="flex items-center gap-2">
								<Dumbbell className="text-primary h-4 w-4" />
								<CardTitle className="text-base">{plan.name}</CardTitle>
							</div>
							<div className="flex items-center gap-1">
								<WorkoutPlanFormDialog
									title="Renommer le plan"
									defaultValues={{ name: plan.name }}
									trigger={
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<Pencil className="h-3.5 w-3.5" />
										</Button>
									}
									onSubmit={async (values) => {
										await updatePlan.mutateAsync({ id: plan.id, ...values });
									}}
								/>
								<Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => deletePlan.mutate({ id: plan.id })}>
									<Trash2 className="h-3.5 w-3.5" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col gap-2">
								<p className="text-muted-foreground text-sm">
									{plan.exerciseCount} exercice{plan.exerciseCount !== 1 ? 's' : ''}
								</p>
								<Link
									to="/workouts/$planId"
									params={{ planId: plan.id }}
									className="text-primary mt-1 inline-flex items-center text-sm hover:underline"
								>
									Editer le plan
								</Link>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
