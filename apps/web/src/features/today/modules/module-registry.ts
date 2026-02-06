import type { ComponentType } from 'react';

import type { PlannedDayData } from '../../calendar/types';

export interface ModuleProps {
	slot: PlannedDayData['slots'][number];
	currentMinutes: number;
}

const modules: Record<string, ComponentType<ModuleProps>> = {};

export function getModuleComponent(moduleType: string | null): ComponentType<ModuleProps> | undefined {
	if (!moduleType) return undefined;
	return modules[moduleType];
}
