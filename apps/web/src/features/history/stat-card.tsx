import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
	label: string;
	value: string | number;
	icon: LucideIcon;
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
	return (
		<div className="bg-muted/50 rounded-md p-3 text-center">
			<div className="text-muted-foreground mb-1 flex items-center justify-center gap-1.5">
				<Icon className="h-3.5 w-3.5" />
				<span className="text-xs">{label}</span>
			</div>
			<p className="text-lg font-bold">{value}</p>
		</div>
	);
}
