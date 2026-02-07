import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';

interface ExerciseFilterProps {
	value: string | undefined;
	onChange: (exerciseId: string | undefined) => void;
}

export function ExerciseFilter({ value, onChange }: ExerciseFilterProps) {
	const exercisesQuery = trpc.exercise.list.useQuery({});

	const exercises = exercisesQuery.data ?? [];

	return (
		<Select value={value ?? '__all__'} onValueChange={(v) => onChange(v === '__all__' ? undefined : v)}>
			<SelectTrigger className="w-full sm:w-[250px]">
				<SelectValue placeholder="Tous les exercices" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="__all__">Tous les exercices</SelectItem>
				{exercises.map((ex) => (
					<SelectItem key={ex.id} value={ex.id}>
						{ex.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
