import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { workoutSession, workoutSet } from '../../db/schema';
import { authedProcedure, router } from '../trpc';

export const statsRouter = router({
	weightProgression: authedProcedure.input(z.object({ exerciseId: z.string() })).query(async ({ ctx, input }) => {
		const userId = ctx.session.user.id;

		const sessions = await ctx.db.query.workoutSession.findMany({
			where: and(eq(workoutSession.userId, userId), eq(workoutSession.status, 'completed')),
			orderBy: desc(workoutSession.startedAt),
			with: {
				sets: true,
			},
		});

		const result: Array<{ date: string; maxWeight: number; sessionId: string }> = [];

		for (const session of sessions) {
			const exerciseSets = session.sets.filter((s) => s.exerciseId === input.exerciseId);
			if (exerciseSets.length === 0) continue;

			const maxWeight = Math.max(...exerciseSets.map((s) => s.weight));
			result.push({
				date: session.startedAt.toISOString(),
				maxWeight,
				sessionId: session.id,
			});
		}

		return result.reverse();
	}),

	volumeOverTime: authedProcedure.input(z.object({ exerciseId: z.string().optional() })).query(async ({ ctx, input }) => {
		const userId = ctx.session.user.id;

		const sessions = await ctx.db.query.workoutSession.findMany({
			where: and(eq(workoutSession.userId, userId), eq(workoutSession.status, 'completed')),
			orderBy: desc(workoutSession.startedAt),
			with: {
				sets: true,
			},
		});

		const result: Array<{ date: string; volume: number; sessionId: string }> = [];

		for (const session of sessions) {
			const sets = input.exerciseId ? session.sets.filter((s) => s.exerciseId === input.exerciseId) : session.sets;
			if (sets.length === 0) continue;

			const volume = sets.reduce((sum, s) => sum + s.reps * s.weight, 0);
			result.push({
				date: session.startedAt.toISOString(),
				volume,
				sessionId: session.id,
			});
		}

		return result.reverse();
	}),

	exerciseSummary: authedProcedure.input(z.object({ exerciseId: z.string() })).query(async ({ ctx, input }) => {
		const userId = ctx.session.user.id;

		const sets = await ctx.db.query.workoutSet.findMany({
			where: and(eq(workoutSet.userId, userId), eq(workoutSet.exerciseId, input.exerciseId)),
			with: {
				session: true,
			},
		});

		// Only consider sets from completed sessions
		const completedSets = sets.filter((s) => s.session.status === 'completed');

		if (completedSets.length === 0) {
			return { totalSessions: 0, totalSets: 0, bestWeight: 0, bestVolume: 0, lastWeight: 0, lastDate: null };
		}

		const sessionIds = new Set(completedSets.map((s) => s.sessionId));
		const totalSessions = sessionIds.size;
		const totalSets = completedSets.length;
		const bestWeight = Math.max(...completedSets.map((s) => s.weight));

		// Compute volume per session and get best
		const volumeBySession = new Map<string, number>();
		for (const s of completedSets) {
			volumeBySession.set(s.sessionId, (volumeBySession.get(s.sessionId) ?? 0) + s.reps * s.weight);
		}
		const bestVolume = Math.max(...volumeBySession.values());

		// Sort by completedAt to get last weight
		const sorted = [...completedSets].sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
		const lastWeight = sorted[0].weight;
		const lastDate = sorted[0].session.startedAt.toISOString();

		return { totalSessions, totalSets, bestWeight, bestVolume, lastWeight, lastDate };
	}),
});
