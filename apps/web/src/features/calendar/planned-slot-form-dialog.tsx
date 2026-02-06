import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formResolver } from '@/lib/form';
import { trpc } from '@/lib/trpc';

import { plannedSlotSchema, type PlannedSlotValues } from './schemas';

const EMPTY_VALUES: PlannedSlotValues = { startTime: '', endTime: '', subcategoryId: '' };

interface PlannedSlotFormDialogProps {
	trigger?: React.ReactNode;
	defaultValues?: PlannedSlotValues;
	onSubmit: (values: PlannedSlotValues) => Promise<void>;
	title: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function PlannedSlotFormDialog({
	trigger,
	defaultValues,
	onSubmit,
	title,
	open: controlledOpen,
	onOpenChange,
}: PlannedSlotFormDialogProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

	const categoriesQuery = trpc.category.list.useQuery();

	const form = useForm<PlannedSlotValues>({
		resolver: formResolver(plannedSlotSchema),
		defaultValues: defaultValues ?? EMPTY_VALUES,
	});

	// Reset form values each time the dialog opens
	 
	useEffect(() => {
		if (open) {
			form.reset(defaultValues ?? EMPTY_VALUES);
		}
	}, [open]);

	async function handleSubmit(values: PlannedSlotValues) {
		await onSubmit(values);
		setOpen(false);
		form.reset();
	}

	const categories = categoriesQuery.data ?? [];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
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
