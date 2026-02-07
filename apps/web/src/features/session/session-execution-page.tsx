import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { trpc } from '@/lib/trpc';

import { Route } from '../../routes/session.$sessionId';
import { AbandonConfirmDialog } from './abandon-confirm-dialog';
import { ExerciseNavigation } from './exercise-navigation';
import { ExerciseView } from './exercise-view';
import { RestTimerOverlay } from './rest-timer-overlay';
import type { LogSetValues } from './schemas';
import { SessionCompletionDialog, type WeightUpdate } from './session-completion-dialog';
import {
	computeSessionSummary,
	findFirstIncompleteExerciseIndex,
	getSessionProgress,
	getWeightDiffs,
	isSessionFullyComplete,
} from './session-core';
import { SessionHeader } from './session-header';
import { useRestTimer } from './use-rest-timer';
import { useSessionTimer } from './use-session-timer';

export function SessionExecutionPage() {
	const { sessionId } = Route.useParams();
	const navigate = useNavigate();
	const utils = trpc.useUtils();

	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const [showCompletion, setShowCompletion] = useState(false);
	const [showAbandon, setShowAbandon] = useState(false);
	const [showRestTimer, setShowRestTimer] = useState(false);
	const [initialIndexSet, setInitialIndexSet] = useState(false);

	const restTimer = useRestTimer();

	const sessionQuery = trpc.workoutSession.getById.useQuery({ id: sessionId });
	const session = sessionQuery.data;

	const elapsedDisplay = useSessionTimer(session?.startedAt);

	const logSet = trpc.workoutSet.log.useMutation({
		onSuccess: () => utils.workoutSession.getById.invalidate({ id: sessionId }),
	});
	const updateSet = trpc.workoutSet.update.useMutation({
		onSuccess: () => utils.workoutSession.getById.invalidate({ id: sessionId }),
	});
	const deleteSet = trpc.workoutSet.delete.useMutation({
		onSuccess: () => utils.workoutSession.getById.invalidate({ id: sessionId }),
	});
	const updatePlanExercise = trpc.workoutPlanExercise.update.useMutation();
	const completeSession = trpc.workoutSession.complete.useMutation({
		onSuccess: () => {
			utils.workoutSession.getById.invalidate({ id: sessionId });
			navigate({ to: '/' });
		},
	});
	const abandonSession = trpc.workoutSession.abandon.useMutation({
		onSuccess: () => {
			navigate({ to: '/' });
		},
	});

	const exercises = session?.workoutPlan?.exercises ?? [];
	const loggedSets = session?.sets ?? [];
	const currentExercise = exercises[currentExerciseIndex];
	const progress = getSessionProgress(exercises, loggedSets);
	const fullyComplete = isSessionFullyComplete(exercises, loggedSets);

	// Set initial index to first incomplete exercise
	useEffect(() => {
		if (exercises.length > 0 && !initialIndexSet) {
			setCurrentExerciseIndex(findFirstIncompleteExerciseIndex(exercises, loggedSets));
			setInitialIndexSet(true);
		}
	}, [exercises, loggedSets, initialIndexSet]);

	const handleLogSet = useCallback(
		(values: LogSetValues) => {
			if (!currentExercise) return;
			const setsForExercise = loggedSets.filter((s) => s.workoutPlanExerciseId === currentExercise.id);
			logSet.mutate(
				{
					sessionId,
					exerciseId: currentExercise.exercise.id,
					workoutPlanExerciseId: currentExercise.id,
					setNumber: setsForExercise.length + 1,
					...values,
				},
				{
					onSuccess: () => {
						// Auto-start rest timer
						restTimer.start(currentExercise.plannedRestSeconds);
						setShowRestTimer(true);
					},
				},
			);
		},
		[currentExercise, loggedSets, logSet, sessionId, restTimer],
	);

	const handleEditSet = useCallback(
		(setId: string, values: LogSetValues) => {
			updateSet.mutate({ id: setId, ...values });
		},
		[updateSet],
	);

	const handleDeleteSet = useCallback(
		(setId: string) => {
			deleteSet.mutate({ id: setId });
		},
		[deleteSet],
	);

	const handleDismissRestTimer = useCallback(() => {
		restTimer.reset();
		setShowRestTimer(false);
	}, [restTimer]);

	const handleFinish = useCallback(() => {
		setShowCompletion(true);
	}, []);

	const handleComplete = useCallback(
		async (values: { notes?: string }, weightUpdates: WeightUpdate[]) => {
			for (const update of weightUpdates) {
				const ex = exercises.find((e) => e.id === update.workoutPlanExerciseId);
				if (ex) {
					await updatePlanExercise.mutateAsync({
						id: ex.id,
						plannedSets: ex.plannedSets,
						plannedReps: ex.plannedReps,
						plannedWeight: update.newWeight,
						plannedRestSeconds: ex.plannedRestSeconds,
					});
				}
			}
			completeSession.mutate({ id: sessionId, notes: values.notes });
		},
		[completeSession, sessionId, exercises, updatePlanExercise],
	);

	const handleAbandon = useCallback(() => {
		abandonSession.mutate({ id: sessionId });
	}, [abandonSession, sessionId]);

	if (sessionQuery.isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (!session || !session.workoutPlan) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p className="text-muted-foreground">Seance introuvable.</p>
			</div>
		);
	}

	const summary = computeSessionSummary(loggedSets, session.startedAt, exercises.length);
	const weightDiffs = getWeightDiffs(exercises, loggedSets);

	return (
		<div className="mx-auto flex min-h-screen w-full max-w-lg flex-col">
			<SessionHeader
				planName={session.workoutPlan.name}
				elapsedDisplay={elapsedDisplay}
				progress={progress}
				onAbandon={() => setShowAbandon(true)}
				onFinish={handleFinish}
				canFinish={fullyComplete}
			/>

			{currentExercise && (
				<ExerciseView
					planExercise={currentExercise}
					loggedSets={loggedSets}
					onLogSet={handleLogSet}
					onEditSet={handleEditSet}
					onDeleteSet={handleDeleteSet}
					isLogging={logSet.isPending}
				/>
			)}

			{exercises.length > 0 && (
				<ExerciseNavigation
					currentIndex={currentExerciseIndex}
					totalExercises={exercises.length}
					onPrevious={() => setCurrentExerciseIndex((i) => Math.max(0, i - 1))}
					onNext={() => setCurrentExerciseIndex((i) => Math.min(exercises.length - 1, i + 1))}
				/>
			)}

			{showRestTimer && (restTimer.isRunning || restTimer.isComplete || restTimer.remainingSeconds > 0) && (
				<RestTimerOverlay
					remainingSeconds={restTimer.remainingSeconds}
					totalSeconds={restTimer.totalSeconds}
					isRunning={restTimer.isRunning}
					isComplete={restTimer.isComplete}
					onPause={restTimer.pause}
					onResume={restTimer.resume}
					onSkip={restTimer.skip}
					onDismiss={handleDismissRestTimer}
				/>
			)}

			<SessionCompletionDialog
				open={showCompletion}
				onOpenChange={setShowCompletion}
				summary={summary}
				weightDiffs={weightDiffs}
				onComplete={handleComplete}
				isSubmitting={completeSession.isPending || updatePlanExercise.isPending}
			/>

			<AbandonConfirmDialog
				open={showAbandon}
				onOpenChange={setShowAbandon}
				onConfirm={handleAbandon}
				isSubmitting={abandonSession.isPending}
			/>
		</div>
	);
}
