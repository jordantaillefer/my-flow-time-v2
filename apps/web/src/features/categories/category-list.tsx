import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

import { CategoryFormDialog } from './category-form-dialog';
import type { CategoryValues, SubcategoryValues } from './schemas';
import { SubcategoryFormDialog } from './subcategory-form-dialog';

export function CategoryList() {
	const utils = trpc.useUtils();
	const categoriesQuery = trpc.category.list.useQuery();
	const createCategory = trpc.category.create.useMutation({ onSuccess: () => utils.category.list.invalidate() });
	const updateCategory = trpc.category.update.useMutation({ onSuccess: () => utils.category.list.invalidate() });
	const deleteCategory = trpc.category.delete.useMutation({ onSuccess: () => utils.category.list.invalidate() });
	const createSubcategory = trpc.subcategory.create.useMutation({ onSuccess: () => utils.category.list.invalidate() });
	const updateSubcategory = trpc.subcategory.update.useMutation({ onSuccess: () => utils.category.list.invalidate() });
	const deleteSubcategory = trpc.subcategory.delete.useMutation({ onSuccess: () => utils.category.list.invalidate() });

	if (categoriesQuery.isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
			</div>
		);
	}

	const categories = categoriesQuery.data ?? [];

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<CategoryFormDialog
					title="Nouvelle categorie"
					trigger={
						<Button size="sm">
							<Plus className="mr-2 h-4 w-4" />
							Categorie
						</Button>
					}
					onSubmit={async (values: CategoryValues) => {
						await createCategory.mutateAsync(values);
					}}
				/>
			</div>

			{categories.length === 0 && <p className="text-muted-foreground py-8 text-center text-sm">Aucune categorie.</p>}

			<div className="grid gap-4 sm:grid-cols-2">
				{categories.map((cat) => (
					<Card key={cat.id}>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
								<CardTitle className="text-base">{cat.name}</CardTitle>
							</div>
							<div className="flex items-center gap-1">
								<CategoryFormDialog
									title="Modifier la categorie"
									defaultValues={{ name: cat.name, icon: cat.icon, color: cat.color }}
									trigger={
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<Pencil className="h-3.5 w-3.5" />
										</Button>
									}
									onSubmit={async (values: CategoryValues) => {
										await updateCategory.mutateAsync({ id: cat.id, ...values });
									}}
								/>
								{!cat.isDefault && (
									<Button
										variant="ghost"
										size="icon"
										className="text-destructive h-8 w-8"
										onClick={() => deleteCategory.mutate({ id: cat.id })}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								)}
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{cat.subcategories.map((sub) => (
									<div key={sub.id} className="flex items-center gap-1">
										<Badge variant="secondary" className="gap-1">
											{sub.name}
											{sub.moduleType && (
												<span className="bg-primary text-primary-foreground rounded px-1 text-[10px]">{sub.moduleType}</span>
											)}
											{!sub.isDefault && (
												<button
													onClick={() => deleteSubcategory.mutate({ id: sub.id })}
													className="text-muted-foreground hover:text-destructive ml-1 transition-colors"
												>
													<Trash2 className="h-3 w-3" />
												</button>
											)}
										</Badge>
									</div>
								))}
								<SubcategoryFormDialog
									title="Nouvelle sous-categorie"
									trigger={
										<Button variant="outline" size="sm" className="h-6 px-2 text-xs">
											<Plus className="mr-1 h-3 w-3" />
											Ajouter
										</Button>
									}
									onSubmit={async (values: SubcategoryValues) => {
										await createSubcategory.mutateAsync({
											...values,
											categoryId: cat.id,
										});
									}}
								/>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
