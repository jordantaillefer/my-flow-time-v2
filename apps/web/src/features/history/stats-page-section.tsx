import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FeelingChart } from './feeling-chart';
import { VolumeChart } from './volume-chart';
import { WeightChart } from './weight-chart';

interface StatsPageSectionProps {
	exerciseId?: string;
}

export function StatsPageSection({ exerciseId }: StatsPageSectionProps) {
	return (
		<Tabs defaultValue="weight" className="space-y-4">
			<TabsList>
				<TabsTrigger value="weight">Poids</TabsTrigger>
				<TabsTrigger value="volume">Volume</TabsTrigger>
				<TabsTrigger value="feeling">Ressenti</TabsTrigger>
			</TabsList>
			<TabsContent value="weight">
				{exerciseId ? (
					<WeightChart exerciseId={exerciseId} />
				) : (
					<div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
						<p>Selectionnez un exercice pour voir la progression du poids</p>
					</div>
				)}
			</TabsContent>
			<TabsContent value="volume">
				<VolumeChart exerciseId={exerciseId} />
			</TabsContent>
			<TabsContent value="feeling">
				<FeelingChart exerciseId={exerciseId} />
			</TabsContent>
		</Tabs>
	);
}
