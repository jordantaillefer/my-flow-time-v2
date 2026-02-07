import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formResolver } from '@/lib/form';

const workoutExerciseSchema = z.object({
	plannedSets: z.coerce.number().int().min(1, 'Min 1 serie'),
	plannedReps: z.coerce.number().int().min(1, 'Min 1 rep'),
	plannedWeight: z.coerce.number().min(0, 'Poids >= 0'),
	plannedRestSeconds: z.coerce.number().int().min(0, 'Repos >= 0'),
});

export type WorkoutExerciseValues = z.infer<typeof workoutExerciseSchema>;

const DEFAULT_VALUES: WorkoutExerciseValues = {
	plannedSets: 3,
	plannedReps: 10,
	plannedWeight: 0,
	plannedRestSeconds: 90,
};

interface WorkoutExerciseFormDialogProps {
	exerciseName?: string;
	defaultValues?: WorkoutExerciseValues;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: WorkoutExerciseValues) => Promise<void>;
}

export function WorkoutExerciseFormDialog({
	exerciseName,
	defaultValues,
	open,
	onOpenChange,
	onSubmit,
}: WorkoutExerciseFormDialogProps) {
	const form = useForm<WorkoutExerciseValues>({
		resolver: formResolver(workoutExerciseSchema),
		defaultValues: defaultValues ?? DEFAULT_VALUES,
	});

	useEffect(() => {
		if (open) {
			form.reset(defaultValues ?? DEFAULT_VALUES);
		}
	}, [open]);

	async function handleSubmit(values: WorkoutExerciseValues) {
		await onSubmit(values);
		onOpenChange(false);
		form.reset();
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>{exerciseName ? `Configurer : ${exerciseName}` : 'Configurer l\'exercice'}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="plannedSets"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Series</FormLabel>
										<FormControl>
											<Input type="number" min={1} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="plannedReps"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Repetitions</FormLabel>
										<FormControl>
											<Input type="number" min={1} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="plannedWeight"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Poids (kg)</FormLabel>
										<FormControl>
											<Input type="number" min={0} step={0.5} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="plannedRestSeconds"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Repos (sec)</FormLabel>
										<FormControl>
											<Input type="number" min={0} step={5} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{defaultValues ? 'Modifier' : 'Ajouter'}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
