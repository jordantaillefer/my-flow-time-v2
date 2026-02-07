import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

const FEELING_EMOJIS = ['', '😫', '😓', '😐', '💪', '🔥'] as const;

interface LoggedSetRowProps {
	setNumber: number;
	reps: number;
	weight: number;
	feeling: number;
	onEdit: () => void;
	onDelete: () => void;
}

export function LoggedSetRow({ setNumber, reps, weight, feeling, onEdit, onDelete }: LoggedSetRowProps) {
	return (
		<div className="bg-muted/50 flex items-center gap-3 rounded-md px-3 py-2 text-sm">
			<span className="text-muted-foreground w-6 text-center font-mono">#{setNumber}</span>
			<span className="font-medium">{reps} reps</span>
			<span className="text-muted-foreground">{weight > 0 ? `${weight} kg` : 'PDC'}</span>
			<span className="ml-auto">{FEELING_EMOJIS[feeling]}</span>
			<Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
				<Pencil className="h-3 w-3" />
			</Button>
			<Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onDelete}>
				<Trash2 className="h-3 w-3" />
			</Button>
		</div>
	);
}
