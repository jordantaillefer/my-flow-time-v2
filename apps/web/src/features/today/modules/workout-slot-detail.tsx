import { Link } from '@tanstack/react-router';
import { Dumbbell, ExternalLink } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';

import { getSlotProgress, getSlotStatus } from '../active-slot';
import type { ModuleProps } from './module-registry';

export function WorkoutSlotDetail({ slot, currentMinutes }: ModuleProps) {
	const status = getSlotStatus(slot, currentMinutes);
	const progress = status === 'active' ? getSlotProgress(slot, currentMinutes) : null;

	const planId = slot.workoutPlanId;
	const planQuery = trpc.workoutPlan.getById.useQuery(
		{ id: planId! },
		{ enabled: !!planId },
	);

	const plan = planQuery.data;

	return (
		<div className="flex flex-col gap-4">
			{/* Horaires */}
			<div className="flex items-center gap-2">
				<span className="font-mono text-lg font-semibold">
					{slot.startTime} — {slot.endTime}
				</span>
				{status === 'active' && (
					<Badge variant="default" className="animate-pulse">
						En cours
					</Badge>
				)}
				{status === 'past' && <Badge variant="secondary">Termine</Badge>}
			</div>

			{/* Categorie / Sous-categorie */}
			<div className="flex items-center gap-2">
				<span
					className="inline-block h-3 w-3 rounded-full"
					style={{ backgroundColor: slot.subcategory.category.color }}
				/>
				<span className="text-muted-foreground text-sm">{slot.subcategory.category.name}</span>
				<span className="text-muted-foreground text-sm">/</span>
				<span className="text-sm font-medium">{slot.subcategory.name}</span>
			</div>

			{/* Barre de progression */}
			{progress !== null && (
				<div className="flex flex-col gap-1">
					<div className="flex justify-between text-xs">
						<span className="text-muted-foreground">Progression</span>
						<span className="font-mono font-medium">{Math.round(progress)}%</span>
					</div>
					<div className="bg-secondary h-2 overflow-hidden rounded-full">
						<div
							className="bg-primary h-full rounded-full transition-all duration-500"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>
			)}

			{/* Plan de seance */}
			{planId && plan ? (
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Dumbbell className="text-primary h-4 w-4" />
							<span className="text-sm font-semibold">{plan.name}</span>
						</div>
						<Link
							to="/workouts/$planId"
							params={{ planId }}
							className="text-primary inline-flex items-center gap-1 text-xs hover:underline"
						>
							Voir le plan
							<ExternalLink className="h-3 w-3" />
						</Link>
					</div>
					<div className="space-y-1.5">
						{plan.exercises.map((wpe) => (
							<div key={wpe.id} className="bg-muted/50 flex items-center gap-2 rounded-md px-3 py-2 text-sm">
								<span className="flex-1 truncate font-medium">{wpe.exercise.name}</span>
								<span className="text-muted-foreground shrink-0 text-xs">
									{wpe.plannedSets} x {wpe.plannedReps}
									{wpe.plannedWeight > 0 && ` @ ${wpe.plannedWeight}kg`}
								</span>
							</div>
						))}
					</div>
				</div>
			) : planId && planQuery.isLoading ? (
				<p className="text-muted-foreground text-sm">Chargement du plan...</p>
			) : (
				<div className="flex flex-col items-center gap-2 py-4">
					<Dumbbell className="text-muted-foreground h-8 w-8" />
					<p className="text-muted-foreground text-sm">Aucun plan de seance associe</p>
					<Link
						to="/workouts"
						className="text-primary text-sm hover:underline"
					>
						Voir les plans de seance
					</Link>
				</div>
			)}
		</div>
	);
}
