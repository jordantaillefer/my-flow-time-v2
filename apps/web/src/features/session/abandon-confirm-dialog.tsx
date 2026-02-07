import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AbandonConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isSubmitting?: boolean;
}

export function AbandonConfirmDialog({ open, onOpenChange, onConfirm, isSubmitting }: AbandonConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Abandonner la seance ?</DialogTitle>
					<DialogDescription>Vos series deja completees seront conservees, mais la seance sera marquee comme abandonnee.</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Continuer la seance
					</Button>
					<Button variant="destructive" onClick={onConfirm} disabled={isSubmitting}>
						Abandonner
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
