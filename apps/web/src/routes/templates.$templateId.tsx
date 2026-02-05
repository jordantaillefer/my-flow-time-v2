import { createFileRoute,Link } from '@tanstack/react-router';
import { ArrowLeft, Clock, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RecurrencePicker } from '@/features/templates/recurrence-picker';
import type { TemplateSlotValues } from '@/features/templates/schemas';
import { SlotFormDialog } from '@/features/templates/slot-form-dialog';
import { trpc } from '@/lib/trpc';

export const Route = createFileRoute('/templates/$templateId')({
	component: TemplateEditorPage,
});

function TemplateEditorPage() {
	const { templateId } = Route.useParams();
	const utils = trpc.useUtils();

	const templateQuery = trpc.dayTemplate.getById.useQuery({ id: templateId });
	const createSlot = trpc.templateSlot.create.useMutation({
		onSuccess: () => {
			utils.dayTemplate.getById.invalidate({ id: templateId });
			utils.dayTemplate.list.invalidate();
		},
	});
	const updateSlot = trpc.templateSlot.update.useMutation({
		onSuccess: () => {
			utils.dayTemplate.getById.invalidate({ id: templateId });
			utils.dayTemplate.list.invalidate();
		},
	});
	const deleteSlot = trpc.templateSlot.delete.useMutation({
		onSuccess: () => {
			utils.dayTemplate.getById.invalidate({ id: templateId });
			utils.dayTemplate.list.invalidate();
		},
	});

	if (templateQuery.isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
			</div>
		);
	}

	const template = templateQuery.data;

	if (!template) {
		return (
			<div className="py-12 text-center">
				<p className="text-muted-foreground">Template introuvable.</p>
				<Link to="/settings" className="text-primary mt-2 inline-block text-sm hover:underline">
					Retour aux parametres
				</Link>
			</div>
		);
	}

	const nextOrder = template.slots.length > 0 ? Math.max(...template.slots.map((s) => s.order)) + 1 : 0;

	return (
		<div className="space-y-6">
			<div>
				<Link to="/settings" className="text-muted-foreground mb-4 inline-flex items-center text-sm hover:underline">
					<ArrowLeft className="mr-1 h-4 w-4" />
					Parametres
				</Link>
				<div className="flex items-center gap-3">
					<div className="h-4 w-4 rounded-full" style={{ backgroundColor: template.color }} />
					<h1 className="text-2xl font-bold">{template.name}</h1>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Creneaux</h2>
					<SlotFormDialog
						title="Nouveau creneau"
						trigger={
							<Button size="sm">
								<Plus className="mr-2 h-4 w-4" />
								Ajouter un creneau
							</Button>
						}
						onSubmit={async (values: TemplateSlotValues) => {
							await createSlot.mutateAsync({
								templateId,
								order: nextOrder,
								...values,
							});
						}}
					/>
				</div>

				{template.slots.length === 0 && (
					<p className="text-muted-foreground py-8 text-center text-sm">Aucun creneau.</p>
				)}

				<div className="space-y-2">
					{template.slots.map((slot) => (
						<Card key={slot.id}>
							<CardContent className="flex items-center justify-between py-3">
								<div className="flex items-center gap-3">
									<Clock className="text-muted-foreground h-4 w-4" />
									<span className="font-mono text-sm">
										{slot.startTime} - {slot.endTime}
									</span>
									<div className="flex items-center gap-1.5">
										<span
											className="inline-block h-2 w-2 rounded-full"
											style={{ backgroundColor: slot.subcategory.category.color }}
										/>
										<span className="text-muted-foreground text-sm">
											{slot.subcategory.category.name} / {slot.subcategory.name}
										</span>
									</div>
								</div>
								<div className="flex items-center gap-1">
									<SlotFormDialog
										title="Modifier le creneau"
										defaultValues={{
											startTime: slot.startTime,
											endTime: slot.endTime,
											subcategoryId: slot.subcategoryId,
										}}
										trigger={
											<Button variant="ghost" size="icon" className="h-8 w-8">
												<Pencil className="h-3.5 w-3.5" />
											</Button>
										}
										onSubmit={async (values: TemplateSlotValues) => {
											await updateSlot.mutateAsync({
												id: slot.id,
												order: slot.order,
												...values,
											});
										}}
									/>
									<Button
										variant="ghost"
										size="icon"
										className="text-destructive h-8 w-8"
										onClick={() => deleteSlot.mutate({ id: slot.id })}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			<RecurrencePicker templateId={templateId} />
		</div>
	);
}
