import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ExerciseNavigationProps {
	currentIndex: number;
	totalExercises: number;
	onPrevious: () => void;
	onNext: () => void;
}

export function ExerciseNavigation({ currentIndex, totalExercises, onPrevious, onNext }: ExerciseNavigationProps) {
	return (
		<div className="bg-background/95 sticky bottom-0 z-40 flex items-center justify-between border-t px-4 py-3 backdrop-blur-sm">
			<Button variant="outline" size="sm" onClick={onPrevious} disabled={currentIndex === 0}>
				<ChevronLeft className="mr-1 h-4 w-4" />
				Precedent
			</Button>
			<span className="text-muted-foreground text-sm font-mono">
				{currentIndex + 1} / {totalExercises}
			</span>
			<Button variant="outline" size="sm" onClick={onNext} disabled={currentIndex >= totalExercises - 1}>
				Suivant
				<ChevronRight className="ml-1 h-4 w-4" />
			</Button>
		</div>
	);
}
