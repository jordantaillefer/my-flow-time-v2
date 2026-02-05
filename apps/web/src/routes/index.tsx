import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: TodayPage,
});

function TodayPage() {
	return (
		<div>
			<h1 className="text-2xl font-bold">Aujourd'hui</h1>
			<p className="text-muted-foreground mt-1">Ta journee en un coup d'oeil.</p>
		</div>
	);
}
