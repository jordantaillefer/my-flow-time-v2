import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { getRestTimerDisplay } from './session-core';

interface RestTimerOverlayProps {
	remainingSeconds: number;
	totalSeconds: number;
	isRunning: boolean;
	isComplete: boolean;
	onPause: () => void;
	onResume: () => void;
	onSkip: () => void;
	onDismiss: () => void;
}

export function RestTimerOverlay({
	remainingSeconds,
	totalSeconds,
	isRunning,
	isComplete,
	onPause,
	onResume,
	onSkip,
	onDismiss,
}: RestTimerOverlayProps) {
	const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 100;
	const circumference = 2 * Math.PI * 70;
	const strokeDashoffset = circumference - (progress / 100) * circumference;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<div className="flex flex-col items-center gap-6">
				<h3 className="text-white text-xl font-semibold">{isComplete ? 'Repos termine !' : 'Repos'}</h3>

				{/* Circular countdown */}
				<div className="relative flex items-center justify-center">
					<svg width="180" height="180" className="-rotate-90">
						<circle cx="90" cy="90" r="70" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
						<circle
							cx="90"
							cy="90"
							r="70"
							stroke="hsl(var(--primary))"
							strokeWidth="8"
							fill="none"
							strokeLinecap="round"
							strokeDasharray={circumference}
							strokeDashoffset={strokeDashoffset}
							className="transition-all duration-1000"
						/>
					</svg>
					<span className="absolute text-white text-4xl font-mono font-bold">
						{isComplete ? '0:00' : getRestTimerDisplay(remainingSeconds)}
					</span>
				</div>

				{/* Controls */}
				<div className="flex items-center gap-4">
					{!isComplete && (
						<>
							{isRunning ? (
								<Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={onPause}>
									<Pause className="h-5 w-5" />
								</Button>
							) : (
								<Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={onResume}>
									<Play className="h-5 w-5" />
								</Button>
							)}
							<Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={onSkip}>
								<SkipForward className="h-5 w-5" />
							</Button>
						</>
					)}
					{isComplete && (
						<Button size="lg" className="rounded-full px-8" onClick={onDismiss}>
							<RotateCcw className="mr-2 h-4 w-4" />
							Continuer
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
