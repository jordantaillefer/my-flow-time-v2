import { createFileRoute } from '@tanstack/react-router';

import { WorkoutPlanList } from '@/features/workout/workout-plan-list';

export const Route = createFileRoute('/workouts/')({
	component: WorkoutsPage,
});

function WorkoutsPage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold">Plans de seance</h1>
				<p className="text-muted-foreground mt-1">Creez et gerez vos plans d'entrainement</p>
			</div>
			<WorkoutPlanList />
		</div>
	);
}
