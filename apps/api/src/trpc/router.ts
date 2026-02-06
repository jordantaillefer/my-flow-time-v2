import { categoryRouter, subcategoryRouter } from './routers/category';
import { dayTemplateRouter } from './routers/day-template';
import { exerciseRouter } from './routers/exercise';
import { plannedDayRouter } from './routers/planned-day';
import { plannedSlotRouter } from './routers/planned-slot';
import { templateRecurrenceRouter } from './routers/template-recurrence';
import { templateSlotRouter } from './routers/template-slot';
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
});

export type AppRouter = typeof appRouter;
