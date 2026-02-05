import { Link } from '@tanstack/react-router';
import { Calendar, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

import { DAYS_OF_WEEK, type DayTemplateValues } from './schemas';
import { TemplateFormDialog } from './template-form-dialog';

export function TemplateList() {
	const utils = trpc.useUtils();
	const templatesQuery = trpc.dayTemplate.list.useQuery();
	const createTemplate = trpc.dayTemplate.create.useMutation({ onSuccess: () => utils.dayTemplate.list.invalidate() });
	const updateTemplate = trpc.dayTemplate.update.useMutation({ onSuccess: () => utils.dayTemplate.list.invalidate() });
	const deleteTemplate = trpc.dayTemplate.delete.useMutation({ onSuccess: () => utils.dayTemplate.list.invalidate() });

	if (templatesQuery.isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
			</div>
		);
	}

	const templates = templatesQuery.data ?? [];

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<TemplateFormDialog
					title="Nouveau template"
					trigger={
						<Button size="sm">
							<Plus className="mr-2 h-4 w-4" />
							Template
						</Button>
					}
					onSubmit={async (values: DayTemplateValues) => {
						await createTemplate.mutateAsync(values);
					}}
				/>
			</div>

			{templates.length === 0 && (
				<p className="text-muted-foreground py-8 text-center text-sm">Aucun template.</p>
			)}

			<div className="grid gap-4 sm:grid-cols-2">
				{templates.map((tpl) => {
					const assignedDays = tpl.recurrences
						.map((r) => DAYS_OF_WEEK.find((d) => d.value === r.dayOfWeek)?.short)
						.filter(Boolean);

					return (
						<Card key={tpl.id}>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full" style={{ backgroundColor: tpl.color }} />
									<CardTitle className="text-base">{tpl.name}</CardTitle>
								</div>
								<div className="flex items-center gap-1">
									<TemplateFormDialog
										title="Modifier le template"
										defaultValues={{ name: tpl.name, color: tpl.color }}
										trigger={
											<Button variant="ghost" size="icon" className="h-8 w-8">
												<Pencil className="h-3.5 w-3.5" />
											</Button>
										}
										onSubmit={async (values: DayTemplateValues) => {
											await updateTemplate.mutateAsync({ id: tpl.id, ...values });
										}}
									/>
									<Button
										variant="ghost"
										size="icon"
										className="text-destructive h-8 w-8"
										onClick={() => deleteTemplate.mutate({ id: tpl.id })}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col gap-2">
									<div className="text-muted-foreground flex items-center gap-2 text-sm">
										<Calendar className="h-3.5 w-3.5" />
										<span>
											{tpl.slots.length} creneau{tpl.slots.length !== 1 ? 'x' : ''}
										</span>
										{assignedDays.length > 0 && (
											<>
												<span>·</span>
												<span>{assignedDays.join(', ')}</span>
											</>
										)}
									</div>
									{assignedDays.length === 0 && (
										<Badge variant="outline" className="w-fit text-xs">
											Non assigne
										</Badge>
									)}
									<Link
										to="/templates/$templateId"
										params={{ templateId: tpl.id }}
										className="text-primary mt-1 inline-flex items-center text-sm hover:underline"
									>
										Editer les creneaux
									</Link>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
