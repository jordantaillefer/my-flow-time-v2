export interface PlannedDayData {
	id: string;
	date: string;
	templateId: string | null;
	template: { id: string; name: string; color: string } | null;
	slots: Array<{
		id: string;
		startTime: string;
		endTime: string;
		order: number;
		subcategoryId: string;
		workoutPlanId: string | null;
		workoutPlan: { id: string; name: string } | null;
		subcategory: {
			id: string;
			name: string;
			moduleType: string | null;
			category: { id: string; name: string; color: string };
		};
	}>;
}
