import type { ComponentType } from 'react';

import type { PlannedDayData } from '../../calendar/types';
import { WorkoutSlotDetail } from './workout-slot-detail';

export interface ModuleProps {
	slot: PlannedDayData['slots'][number];
	currentMinutes: number;
}

const modules: Record<string, ComponentType<ModuleProps>> = {
	workout: WorkoutSlotDetail,
};

export function getModuleComponent(moduleType: string | null): ComponentType<ModuleProps> | undefined {
	if (!moduleType) return undefined;
	return modules[moduleType];
}
