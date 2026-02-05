import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formResolver } from '@/lib/form';
import { trpc } from '@/lib/trpc';

import { templateSlotSchema, type TemplateSlotValues } from './schemas';

interface SlotFormDialogProps {
	trigger: React.ReactNode;
	defaultValues?: TemplateSlotValues;
	onSubmit: (values: TemplateSlotValues) => Promise<void>;
	title: string;
}

export function SlotFormDialog({ trigger, defaultValues, onSubmit, title }: SlotFormDialogProps) {
	const [open, setOpen] = useState(false);
	const categoriesQuery = trpc.category.list.useQuery();

	const form = useForm<TemplateSlotValues>({
		resolver: formResolver(templateSlotSchema),
		defaultValues: defaultValues ?? { startTime: '', endTime: '', subcategoryId: '' },
	});

	async function handleSubmit(values: TemplateSlotValues) {
		await onSubmit(values);
		setOpen(false);
		form.reset();
	}

	const categories = categoriesQuery.data ?? [];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Debut</FormLabel>
										<FormControl>
											<Input type="time" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="endTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Fin</FormLabel>
										<FormControl>
											<Input type="time" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="subcategoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sous-categorie</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Choisir une sous-categorie" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map((cat) => (
												<SelectGroup key={cat.id}>
													<SelectLabel>
														<span className="flex items-center gap-1.5">
															<span
																className="inline-block h-2 w-2 rounded-full"
																style={{ backgroundColor: cat.color }}
															/>
															{cat.name}
														</span>
													</SelectLabel>
													{cat.subcategories.map((sub) => (
														<SelectItem key={sub.id} value={sub.id}>
															{sub.name}
														</SelectItem>
													))}
												</SelectGroup>
											))}
										</SelectContent>
									</Select>
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
