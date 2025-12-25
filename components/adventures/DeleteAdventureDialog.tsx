import useDeleteAdventure from '@/hooks/adventures/useDeleteAdventure';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Button } from '../ui/button';

interface DeleteAdventureDialogProps {
    adventureId: number;
}

export default function DeleteAdventureDialog({
    adventureId,
}: DeleteAdventureDialogProps) {
    const deleteAdventure = useDeleteAdventure();
    const [isDeleting, setIsDeleting] = useState(false);

    // Delete function
    const handleDelete = async () => {
        if (!adventureId) return;
        setIsDeleting(true);
        try {
            await deleteAdventure.mutateAsync(adventureId);
        } finally {
            setIsDeleting(false);
        }
    };
    return <>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-1">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="w-[90%] max-w-md rounded-lg p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">
                        Confirm Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-sm mt-2">
                        This action cannot be undone. Are you sure?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" disabled={isDeleting} onClick={handleDelete}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
}