import { getFeelingEmoji, type GroupedExercise } from './history-core';

interface SessionExerciseTableProps {
	group: GroupedExercise;
}

export function SessionExerciseTable({ group }: SessionExerciseTableProps) {
	return (
		<div className="space-y-2">
			<h3 className="font-medium">{group.exerciseName}</h3>
			<div className="rounded-md border">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b bg-muted/50">
							<th className="px-3 py-2 text-left font-medium text-muted-foreground">Serie</th>
							<th className="px-3 py-2 text-right font-medium text-muted-foreground">Reps</th>
							<th className="px-3 py-2 text-right font-medium text-muted-foreground">Poids</th>
							<th className="px-3 py-2 text-center font-medium text-muted-foreground">Ressenti</th>
						</tr>
					</thead>
					<tbody>
						{group.sets.map((set, i) => (
							<tr key={i} className="border-b last:border-0">
								<td className="px-3 py-2 text-left">{set.setNumber}</td>
								<td className="px-3 py-2 text-right">{set.reps}</td>
								<td className="px-3 py-2 text-right">{set.weight > 0 ? `${set.weight} kg` : 'PDC'}</td>
								<td className="px-3 py-2 text-center">{getFeelingEmoji(set.feeling)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
