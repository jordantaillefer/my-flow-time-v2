import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formResolver } from '@/lib/form';
import { cn } from '@/lib/utils';

import { MODULE_TYPES, subcategorySchema, type SubcategoryValues } from './schemas';

interface SubcategoryFormDialogProps {
	trigger: React.ReactNode;
	defaultValues?: SubcategoryValues;
	onSubmit: (values: SubcategoryValues) => Promise<void>;
	title: string;
}

export function SubcategoryFormDialog({ trigger, defaultValues, onSubmit, title }: SubcategoryFormDialogProps) {
	const [open, setOpen] = useState(false);

	const form = useForm<SubcategoryValues>({
		resolver: formResolver(subcategorySchema),
		defaultValues: defaultValues ?? { name: '', moduleType: null },
	});

	async function handleSubmit(values: SubcategoryValues) {
		await onSubmit(values);
		setOpen(false);
		form.reset();
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nom</FormLabel>
									<FormControl>
										<Input placeholder="Musculation" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="moduleType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Module associe (optionnel)</FormLabel>
									<FormControl>
										<div className="flex flex-wrap gap-2">
											<button
												type="button"
												onClick={() => field.onChange(null)}
												className={cn(
													'rounded-md border px-3 py-1.5 text-xs transition-colors',
													!field.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-accent',
												)}
											>
												Aucun
											</button>
											{MODULE_TYPES.map((mod) => (
												<button
													key={mod.value}
													type="button"
													onClick={() => field.onChange(mod.value)}
													className={cn(
														'rounded-md border px-3 py-1.5 text-xs transition-colors',
														field.value === mod.value
															? 'border-primary bg-primary text-primary-foreground'
															: 'border-border hover:bg-accent',
													)}
												>
													{mod.label}
												</button>
											))}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{defaultValues ? 'Modifier' : 'Creer'}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
