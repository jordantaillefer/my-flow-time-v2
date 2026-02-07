import { Flag, LogOut, Timer } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SessionHeaderProps {
	planName: string;
	elapsedDisplay: string;
	progress: { done: number; total: number; percent: number };
	onAbandon: () => void;
	onFinish: () => void;
	canFinish: boolean;
}

export function SessionHeader({ planName, elapsedDisplay, progress, onAbandon, onFinish, canFinish }: SessionHeaderProps) {
	return (
		<div className="bg-background/95 sticky top-0 z-40 border-b px-4 py-3 backdrop-blur-sm">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<h1 className="text-lg font-bold truncate max-w-[180px]">{planName}</h1>
					<Badge variant="outline" className="gap-1">
						<Timer className="h-3 w-3" />
						{elapsedDisplay}
					</Badge>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" onClick={onAbandon}>
						<LogOut className="mr-1 h-4 w-4" />
						Abandonner
					</Button>
					<Button size="sm" onClick={onFinish} disabled={!canFinish}>
						<Flag className="mr-1 h-4 w-4" />
						Terminer
					</Button>
				</div>
			</div>
			<div className="mt-2 flex items-center gap-2">
				<div className="bg-secondary h-2 flex-1 overflow-hidden rounded-full">
					<div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
				</div>
				<span className="text-muted-foreground text-xs font-mono whitespace-nowrap">
					{progress.done}/{progress.total}
				</span>
			</div>
		</div>
	);
}
