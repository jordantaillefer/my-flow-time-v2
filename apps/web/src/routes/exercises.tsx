import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/exercises')({
	component: ExercisesPage,
});

function ExercisesPage() {
	return (
		<div>
			<h1 className="text-2xl font-bold">Exercices</h1>
			<p className="text-muted-foreground mt-1">Base d'exercices.</p>
		</div>
	);
}
