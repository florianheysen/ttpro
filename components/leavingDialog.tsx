import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
  
  type LeavingDialogProps = {
    isOpen: boolean;
    yesCallback: () => void;
    noCallback: () => void;
  };
  
  export const LeavingDialog = ({ isOpen, yesCallback, noCallback }: LeavingDialogProps) => {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Les données seront perdues.
            </AlertDialogTitle>
            <AlertDialogDescription>Êtes-vous sûr de vouloir quitter la page ?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => noCallback()}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => yesCallback()}>Quitter</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };