import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { COLOR_OPTIONS } from '@/features/categories/schemas';
import { formResolver } from '@/lib/form';
import { cn } from '@/lib/utils';

import { dayTemplateSchema, type DayTemplateValues } from './schemas';

interface TemplateFormDialogProps {
	trigger: React.ReactNode;
	defaultValues?: DayTemplateValues;
	onSubmit: (values: DayTemplateValues) => Promise<void>;
	title: string;
}

export function TemplateFormDialog({ trigger, defaultValues, onSubmit, title }: TemplateFormDialogProps) {
	const [open, setOpen] = useState(false);

	const form = useForm<DayTemplateValues>({
		resolver: formResolver(dayTemplateSchema),
		defaultValues: defaultValues ?? { name: '', color: COLOR_OPTIONS[0] },
	});

	async function handleSubmit(values: DayTemplateValues) {
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
										<Input placeholder="Journee type semaine" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="color"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Couleur</FormLabel>
									<FormControl>
										<div className="flex flex-wrap gap-2">
											{COLOR_OPTIONS.map((color) => (
												<button
													key={color}
													type="button"
													onClick={() => field.onChange(color)}
													className={cn(
														'h-8 w-8 rounded-full border-2 transition-transform',
														field.value === color ? 'scale-110 border-foreground' : 'border-transparent',
													)}
													style={{ backgroundColor: color }}
												/>
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
