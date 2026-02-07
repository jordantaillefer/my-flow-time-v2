import { Check, Minus, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formResolver } from '@/lib/form';

import { logSetSchema, type LogSetValues } from './schemas';

const FEELINGS = [
	{ value: 1, label: '😫' },
	{ value: 2, label: '😓' },
	{ value: 3, label: '😐' },
	{ value: 4, label: '💪' },
	{ value: 5, label: '🔥' },
] as const;

interface SetLogFormProps {
	defaultValues: LogSetValues;
	onSubmit: (values: LogSetValues) => void;
	isSubmitting?: boolean;
}

export function SetLogForm({ defaultValues, onSubmit, isSubmitting }: SetLogFormProps) {
	const form = useForm<LogSetValues>({
		resolver: formResolver(logSetSchema),
		defaultValues,
	});

	const reps = Number(form.watch('reps')) || 0;
	const weight = Number(form.watch('weight')) || 0;
	const feeling = Number(form.watch('feeling')) || 3;

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="bg-muted/30 rounded-lg border p-4 space-y-4">
			<div className="flex items-center justify-center gap-6">
				{/* Reps */}
				<div className="flex flex-col items-center gap-1">
					<span className="text-muted-foreground text-xs">Reps</span>
					<div className="flex items-center gap-1">
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="h-9 w-9"
							disabled={reps <= 0}
							onClick={() => form.setValue('reps', Math.max(0, reps - 1))}
						>
							<Minus className="h-3.5 w-3.5" />
						</Button>
						<Input {...form.register('reps')} type="number" inputMode="numeric" min="0" className="h-9 w-16 text-center font-mono" />
						<Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => form.setValue('reps', reps + 1)}>
							<Plus className="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>

				{/* Weight */}
				<div className="flex flex-col items-center gap-1">
					<span className="text-muted-foreground text-xs">Poids (kg)</span>
					<div className="flex items-center gap-1">
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="h-9 w-9"
							disabled={weight <= 0}
							onClick={() => form.setValue('weight', Math.max(0, weight - 2.5))}
						>
							<Minus className="h-3.5 w-3.5" />
						</Button>
						<Input
							{...form.register('weight')}
							type="number"
							inputMode="decimal"
							step="0.5"
							min="0"
							className="h-9 w-20 text-center font-mono"
						/>
						<Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => form.setValue('weight', weight + 2.5)}>
							<Plus className="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>
			</div>

			{/* Feeling */}
			<div className="flex items-center justify-center gap-2">
				<span className="text-muted-foreground text-xs mr-1">Ressenti</span>
				{FEELINGS.map((f) => (
					<button
						key={f.value}
						type="button"
						className={`text-lg rounded-md p-1 transition-all ${feeling === f.value ? 'bg-primary/20 ring-primary ring-2 scale-110' : 'opacity-50 hover:opacity-80'}`}
						onClick={() => form.setValue('feeling', f.value)}
					>
						{f.label}
					</button>
				))}
			</div>

			<Button type="submit" className="w-full" disabled={isSubmitting}>
				<Check className="mr-2 h-4 w-4" />
				Valider la serie
			</Button>
		</form>
	);
}
