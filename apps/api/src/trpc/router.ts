import { categoryRouter, subcategoryRouter } from './routers/category';
import { dayTemplateRouter } from './routers/day-template';
import { exerciseRouter } from './routers/exercise';
import { plannedDayRouter } from './routers/planned-day';
import { plannedSlotRouter } from './routers/planned-slot';
import { templateRecurrenceRouter } from './routers/template-recurrence';
import { templateSlotRouter } from './routers/template-slot';
import { workoutPlanRouter } from './routers/workout-plan';
import { workoutPlanExerciseRouter } from './routers/workout-plan-exercise';
import { workoutSessionRouter } from './routers/workout-session';
import { workoutSetRouter } from './routers/workout-set';
import { authedProcedure, publicProcedure, router } from './trpc';

export const appRouter = router({
	health: publicProcedure.query(() => {
		return { ok: true };
	}),
	me: authedProcedure.query(({ ctx }) => {
		return ctx.session.user;
	}),
	category: categoryRouter,
	subcategory: subcategoryRouter,
	dayTemplate: dayTemplateRouter,
	templateSlot: templateSlotRouter,
	templateRecurrence: templateRecurrenceRouter,
	plannedDay: plannedDayRouter,
	plannedSlot: plannedSlotRouter,
	exercise: exerciseRouter,
	workoutPlan: workoutPlanRouter,
	workoutPlanExercise: workoutPlanExerciseRouter,
	workoutSession: workoutSessionRouter,
	workoutSet: workoutSetRouter,
});

export type AppRouter = typeof appRouter;
