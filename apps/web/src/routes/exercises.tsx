import { createFileRoute } from '@tanstack/react-router';

import { ExerciseList } from '@/features/exercises/exercise-list';

export const Route = createFileRoute('/exercises')({
	component: ExercisesPage,
});

function ExercisesPage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold">Exercices</h1>
				<p className="text-muted-foreground mt-1">Base d'exercices de musculation.</p>
			</div>
			<ExerciseList />
		</div>
	);
}
