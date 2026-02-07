import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { formResolver } from '@/lib/form';

import { completeSessionSchema, type CompleteSessionValues } from './schemas';
import type { SessionSummary, WeightDiff } from './session-core';

export interface WeightUpdate {
	workoutPlanExerciseId: string;
	newWeight: number;
}

interface SessionCompletionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	summary: SessionSummary;
	weightDiffs: WeightDiff[];
	onComplete: (values: CompleteSessionValues, weightUpdates: WeightUpdate[]) => void;
	isSubmitting?: boolean;
}

function formatWeight(w: number) {
	return w > 0 ? `${w} kg` : 'PDC';
}

export function SessionCompletionDialog({
	open,
	onOpenChange,
	summary,
	weightDiffs,
	onComplete,
	isSubmitting,
}: SessionCompletionDialogProps) {
	const form = useForm<CompleteSessionValues>({
		resolver: formResolver(completeSessionSchema),
		defaultValues: { notes: '' },
	});

	// null = keep planned weight, number = selected new weight
	const [choices, setChoices] = useState<Map<string, number | null>>(() => {
		const map = new Map<string, number | null>();
		for (const diff of weightDiffs) {
			// Pre-select the first (or only) used weight
			map.set(diff.workoutPlanExerciseId, diff.usedWeights[0]);
		}
		return map;
	});

	function selectWeight(exerciseId: string, weight: number | null) {
		setChoices((prev) => {
			const next = new Map(prev);
			next.set(exerciseId, weight);
			return next;
		});
	}

	function handleSubmit(values: CompleteSessionValues) {
		const updates: WeightUpdate[] = [];
		for (const [id, weight] of choices) {
			if (weight !== null) {
				updates.push({ workoutPlanExerciseId: id, newWeight: weight });
			}
		}
		onComplete(values, updates);
	}

	const FEELING_EMOJIS = ['', '😫', '😓', '😐', '💪', '🔥'] as const;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Seance terminee !</DialogTitle>
					<DialogDescription>Recapitulatif de votre seance</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-2 gap-3">
					<div className="bg-muted/50 rounded-md p-3 text-center">
						<p className="text-muted-foreground text-xs">Duree</p>
						<p className="text-lg font-bold">{summary.duration}</p>
					</div>
					<div className="bg-muted/50 rounded-md p-3 text-center">
						<p className="text-muted-foreground text-xs">Exercices</p>
						<p className="text-lg font-bold">{summary.exerciseCount}</p>
					</div>
					<div className="bg-muted/50 rounded-md p-3 text-center">
						<p className="text-muted-foreground text-xs">Series</p>
						<p className="text-lg font-bold">{summary.totalSets}</p>
					</div>
					<div className="bg-muted/50 rounded-md p-3 text-center">
						<p className="text-muted-foreground text-xs">Reps</p>
						<p className="text-lg font-bold">{summary.totalReps}</p>
					</div>
					<div className="bg-muted/50 rounded-md p-3 text-center">
						<p className="text-muted-foreground text-xs">Volume</p>
						<p className="text-lg font-bold">{summary.totalVolume > 0 ? `${summary.totalVolume} kg` : '-'}</p>
					</div>
					<div className="bg-muted/50 rounded-md p-3 text-center">
						<p className="text-muted-foreground text-xs">Ressenti</p>
						<p className="text-lg font-bold">{summary.averageFeeling > 0 ? FEELING_EMOJIS[Math.round(summary.averageFeeling)] : '-'}</p>
					</div>
				</div>

				{weightDiffs.length > 0 && (
					<div className="space-y-3">
						<div>
							<Label>Mettre a jour le plan</Label>
							<p className="text-muted-foreground text-xs mt-0.5">
								Poids differents de ceux prevus. Choisissez le nouveau poids ou gardez l'actuel.
							</p>
						</div>
						<div className="space-y-2">
							{weightDiffs.map((diff) => {
								const selected = choices.get(diff.workoutPlanExerciseId);
								return (
									<div key={diff.workoutPlanExerciseId} className="bg-muted/50 rounded-md px-3 py-2.5 space-y-2">
										<div className="flex items-center gap-2 text-sm">
											<span className="font-medium truncate flex-1">{diff.exerciseName}</span>
											<span className="text-muted-foreground text-xs shrink-0">
												{formatWeight(diff.plannedWeight)}
												<ArrowRight className="inline h-3 w-3 mx-1" />?
											</span>
										</div>
										<div className="flex flex-wrap gap-1.5">
											<button
												type="button"
												onClick={() => selectWeight(diff.workoutPlanExerciseId, null)}
												className={cn(
													'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
													selected === null
														? 'bg-secondary text-secondary-foreground border-secondary'
														: 'text-muted-foreground hover:text-foreground',
												)}
											>
												{formatWeight(diff.plannedWeight)} (actuel)
											</button>
											{diff.usedWeights.map((w) => (
												<button
													key={w}
													type="button"
													onClick={() => selectWeight(diff.workoutPlanExerciseId, w)}
													className={cn(
														'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
														selected === w
															? 'bg-primary text-primary-foreground border-primary'
															: 'text-muted-foreground hover:text-foreground',
													)}
												>
													{formatWeight(w)}
												</button>
											))}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}

				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="notes">Notes (optionnel)</Label>
						<textarea
							id="notes"
							{...form.register('notes')}
							className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
							rows={3}
							placeholder="Comment s'est passee la seance ?"
						/>
					</div>
					<DialogFooter>
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							Terminer la seance
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
