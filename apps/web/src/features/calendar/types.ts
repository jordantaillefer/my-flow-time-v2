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
		subcategory: {
			id: string;
			name: string;
			category: { id: string; name: string; color: string };
		};
	}>;
}
