import { createFileRoute } from '@tanstack/react-router';

import { Separator } from '@/components/ui/separator';
import { CategoryList } from '@/features/categories/category-list';
import { TemplateList } from '@/features/templates/template-list';

export const Route = createFileRoute('/settings')({
	component: SettingsPage,
});

function SettingsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Parametres</h1>
				<p className="text-muted-foreground mt-1">Gere tes categories, sous-categories et templates de journee.</p>
			</div>
			<CategoryList />
			<Separator />
			<div>
				<h2 className="text-lg font-semibold">Templates de journee</h2>
				<p className="text-muted-foreground mt-1">Cree des modeles de journee avec des creneaux horaires.</p>
			</div>
			<TemplateList />
		</div>
	);
}
