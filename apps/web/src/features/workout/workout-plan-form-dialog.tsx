import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formResolver } from '@/lib/form';

const workoutPlanSchema = z.object({
	name: z.string().min(1, 'Nom requis'),
});

type WorkoutPlanValues = z.infer<typeof workoutPlanSchema>;

interface WorkoutPlanFormDialogProps {
	trigger?: React.ReactNode;
	defaultValues?: WorkoutPlanValues;
	onSubmit: (values: WorkoutPlanValues) => Promise<void>;
	title: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function WorkoutPlanFormDialog({
	trigger,
	defaultValues,
	onSubmit,
	title,
	open: controlledOpen,
	onOpenChange,
}: WorkoutPlanFormDialogProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

	const form = useForm<WorkoutPlanValues>({
		resolver: formResolver(workoutPlanSchema),
		defaultValues: defaultValues ?? { name: '' },
	});

	useEffect(() => {
		if (open) {
			form.reset(defaultValues ?? { name: '' });
		}
	}, [open]);

	async function handleSubmit(values: WorkoutPlanValues) {
		await onSubmit(values);
		setOpen(false);
		form.reset();
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
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
										<Input placeholder="Push / Pull / Legs..." {...field} />
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
