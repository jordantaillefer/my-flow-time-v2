import { createFileRoute } from '@tanstack/react-router';

import { ExerciseList } from '@/features/exercises/exercise-list';
import { trpc } from '@/lib/trpc';

export const Route = createFileRoute('/exercises')({
	component: ExercisesPage,
});

function ExercisesPage() {
	const exercisesQuery = trpc.exercise.list.useQuery({});

	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold">Exercices</h1>
				<p className="text-muted-foreground mt-1">
					Base d'exercices de musculation
					{exercisesQuery.data && (
						<span className="ml-1">
							— {exercisesQuery.data.length} exercice
							{exercisesQuery.data.length !== 1 ? 's' : ''}
						</span>
					)}
				</p>
			</div>
			<ExerciseList />
		</div>
	);
}
