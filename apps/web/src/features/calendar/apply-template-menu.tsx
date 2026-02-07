import { DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { trpc } from '@/lib/trpc';

interface ApplyTemplateMenuProps {
	onApply: (templateId: string) => void;
}

export function ApplyTemplateMenu({ onApply }: ApplyTemplateMenuProps) {
	const templatesQuery = trpc.dayTemplate.list.useQuery();
	const templates = templatesQuery.data ?? [];

	if (templates.length === 0) return null;

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>Appliquer un template</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
				{templates.map((t) => (
					<DropdownMenuItem key={t.id} onClick={() => onApply(t.id)}>
						<span className="flex items-center gap-2">
							<span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
							{t.name}
						</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
